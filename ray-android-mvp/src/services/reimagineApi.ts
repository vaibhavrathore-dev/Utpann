/** RAY Android to REAL FastAPI /api/v1/reimagine adapter.
 * Preserves the existing ApprovedScene contract expected by results/preview/AR.
 * No automatic fake-data fallback if a backend URL is configured.
 */
import {
  type ApprovedScene,
  type Material,
  type Part,
  type SpaceCm,
  makeDemoScene,
  validateApprovedScene,
  validateSpace,
} from '../domain/scene';
import { getRayAccessToken } from './rayAuth';

const BASE_URL = process.env.EXPO_PUBLIC_RAY_API_BASE_URL?.trim() || '';
export const isDemoMode = !BASE_URL;

// These types reflect the existing Python schemas.py and /api/v1/reimagine response.
type BackendComponent = {
  id: string; shape: 'box'; dimensions_m: [number, number, number];
  position_m: [number, number, number]; rotation_deg: [number, number, number];
  color_hex: string;
};
type BackendStep = { step: number; title: string; description: string; component_ids: string[] };
type BackendScene = {
  title: string; units: 'meters'; components: BackendComponent[];
  assembly_steps: BackendStep[]; missing_supplies: string[]; safety_notes: string[];
};
type BackendResponse = {
  design: {
    design_id: string;
    model_glb_url: string;
    scene: BackendScene;
  };
  material_observation: unknown | null;
};

const toCm = (xyz: [number, number, number]): [number, number, number] =>
  [xyz[0] * 100, xyz[1] * 100, xyz[2] * 100];

function convertScene(raw: BackendResponse, space: SpaceCm): ApprovedScene {
  const design = raw?.design;
  const s = design?.scene;
  if (!design?.design_id || !s || s.units !== 'meters' || !Array.isArray(s.components)) {
    throw new Error('FastAPI returned an unsupported scene.');
  }
  const parts: Part[] = s.components.map(p => ({
    id: p.id,
    shape: p.shape,
    size_cm: toCm(p.dimensions_m),
    position_cm: toCm(p.position_m),
    rotation_deg: p.rotation_deg,
    color: p.color_hex,
  }));

  const approved: ApprovedScene = {
    status: 'approved',
    project_id: design.design_id,
    design_name: s.title,
    space_cm: space,
    scene: { units: 'cm', origin: 'floor_center', components: parts },
    assembly_steps: s.assembly_steps.map(st => ({
      index: st.step,
      title: st.title,
      instructions: st.description,
      highlight_component_ids: st.component_ids,
    })),
    missing_materials: s.missing_supplies ?? [],
    safety_note: (s.safety_notes ?? []).join('\n'),
  };
  return validateApprovedScene(approved);
}

function makeRequestPayload(space: SpaceCm, materials: Material[]) {
  const invalidSpace = validateSpace(space);
  if (invalidSpace) throw new Error(invalidSpace);
  if (space.width > 600 || space.height > 400 || space.depth > 400) {
    throw new Error('For this MVP the space must be within 600 x 400 x 400 cm.');
  }
  if (materials.length < 1 || materials.length > 25) {
    throw new Error('Add 1 to 25 material entries.');
  }
  if (materials.some(m => !/^[a-zA-Z0-9_-]{1,64}$/.test(m.id))) {
    throw new Error('Material IDs must use letters, numbers, underscore or hyphen.');
  }
  if (new Set(materials.map(m => m.id)).size !== materials.length) {
    throw new Error('Material IDs must be unique.');
  }
  const quantity = materials.reduce((sum, m) => sum + m.quantity, 0);
  if (quantity > 60 || materials.some(m => !Number.isInteger(m.quantity) || m.quantity < 1 || m.quantity > 25)) {
    throw new Error('Each stock entry needs 1–25 boards; total cannot exceed 60.');
  }
  const boards = materials.map(m => ({
    source_id: m.id,
    material_type: 'wood' as const,
    length_cm: m.length_cm,
    width_cm: m.width_cm,
    thickness_cm: m.thickness_cm,
    quantity: m.quantity,
    // The backend only allocates confirmed GOOD stock for the first supported template.
    condition: m.condition === 'needs_inspection' ? 'unknown' : m.condition,
  }));
  if (boards.filter(b => b.condition === 'good').reduce((sum, b) => sum + b.quantity, 0) < 4) {
    throw new Error('The current mini-shelf requires at least four confirmed-good wooden boards.');
  }
  return {
    template_id: 'mini_shelf_v1' as const,
    space: { width_cm: space.width, height_cm: space.height, depth_cm: space.depth },
    boards,
  };
}

function readError(json: unknown): string {
  if (!json || typeof json !== 'object') return 'Unexpected response from backend.';
  const detail = (json as { detail?: unknown }).detail;
  if (typeof detail === 'string') return detail;
  if (detail && typeof detail === 'object' && 'message' in detail) {
    const message = (detail as { message?: unknown }).message;
    if (typeof message === 'string') return message;
  }
  return 'See the FastAPI terminal for request details.';
}

export async function createPlan(space: SpaceCm, materials: Material[]): Promise<ApprovedScene> {
  if (!BASE_URL) return makeDemoScene(space, materials);
  const payload = makeRequestPayload(space, materials);
  const token = await getRayAccessToken();
  const controller = new AbortController();
  // Real Qwen photo calls can take up to 180s on the Windows laptop.
  const timer = setTimeout(() => controller.abort(), 210000);
  try {
    const form = new FormData();
    form.append('payload_json', JSON.stringify(payload));
    // Backend accepts ONE optional image, not the frontend's former images[] array.
    const firstPhoto = materials.find(m => !!m.photoUri);
    if (firstPhoto?.photoUri) {
      const ext = firstPhoto.photoUri.toLowerCase().split('?')[0].endsWith('.png') ? 'png' :
        firstPhoto.photoUri.toLowerCase().split('?')[0].endsWith('.webp') ? 'webp' : 'jpg';
      const mime = ext === 'png' ? 'image/png' : ext === 'webp' ? 'image/webp' : 'image/jpeg';
      form.append('file', {
        uri: firstPhoto.photoUri,
        name: `material.${ext}`,
        type: mime,
      } as any);
    }
    const response = await fetch(`${BASE_URL.replace(/\/$/, '')}/api/v1/reimagine`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      // Never manually set multipart Content-Type; RN/fetch supplies the boundary.
      body: form,
      signal: controller.signal,
    });
    const json: unknown = await response.json().catch(() => null);
    if (!response.ok) {
      throw new Error(`FastAPI ${response.status}: ${readError(json)}`);
    }
    return convertScene(json as BackendResponse, space);
  } catch (error) {
    if ((error as Error).name === 'AbortError') {
      throw new Error('Qwen or FastAPI request timed out. Check both services.');
    }
    throw error;
  } finally {
    clearTimeout(timer);
  }
}
