export type SpaceCm = { width: number; height: number; depth: number; source: 'user_confirmed' };
export type Material = {
  id: string; category: 'wood'; quantity: number;
  length_cm: number; width_cm: number; thickness_cm: number;
  condition: 'good' | 'fair' | 'needs_inspection'; photoUri?: string;
};
export type Part = { id: string; shape: 'box'; size_cm: [number, number, number]; position_cm: [number, number, number]; rotation_deg: [number, number, number]; color: string; };
export type AssemblyStep = { index: number; title: string; instructions: string; highlight_component_ids: string[]; };
export type ApprovedScene = {
  status: 'approved' | 'demo'; project_id: string; design_name: string; space_cm: SpaceCm;
  scene: { units: 'cm'; origin: 'floor_center'; components: Part[] };
  assembly_steps: AssemblyStep[]; missing_materials: string[]; safety_note: string;
};
export const cmToMeters = (v: number) => v / 100;
const finitePositive = (v: number) => Number.isFinite(v) && v > 0;
export function validateSpace(s: SpaceCm): string | null {
  if (![s.width, s.height, s.depth].every(finitePositive)) return 'All three measurements must be positive numbers.';
  if (s.width > 1000 || s.height > 1000 || s.depth > 1000) return 'Please use measurements below 1,000 cm.';
  if (s.width < 40 || s.height < 45 || s.depth < 25) return 'For this starter design, enter at least 40 × 45 × 25 cm.';
  return null;
}
const P = (id: string, size: [number,number,number], pos: [number,number,number]): Part => ({ id, shape:'box', size_cm:size, position_cm:pos, rotation_deg:[0,0,0], color:'#C6A77F' });
/** DEMO-ONLY geometric fixture. Not an engineered building plan or a verified AI response. */
export function makeDemoScene(space: SpaceCm, materials: Material[]): ApprovedScene {
  const err = validateSpace(space); if (err) throw new Error(err);
  const W = Math.min(space.width - 10, 54);
  const H = Math.min(space.height - 10, 44);
  const D = Math.min(space.depth - 7, 21);
  const t = 1.8;
  const inside = W - 2*t;
  const parts = [
    P('base', [W,t,D], [0,t/2,0]),
    P('left', [t,H-2*t,D], [-(W-t)/2,H/2,0]),
    P('right',[t,H-2*t,D], [(W-t)/2,H/2,0]),
    P('middle',[inside,t,D],[0,H*0.52,0]),
    P('top',[W,t,D],[0,H-t/2,0]),
  ];
  const available = materials.filter(m => m.category==='wood' && m.length_cm>=W && m.width_cm>=D && m.thickness_cm>=t && m.condition!=='needs_inspection').reduce((n,m)=>n+m.quantity,0);
  const missing = available >= 5 ? [] : [`Potential shortage: ${5-available} suitable board(s). Confirm usable sizes and condition before building.`];
  return {
    status:'demo',project_id:`local_${Date.now()}`,design_name:'Modular desk organizer',space_cm:space,
    scene:{units:'cm',origin:'floor_center',components:parts},
    assembly_steps:[
      {index:1,title:'Inspect your materials',instructions:'Check each board for damage and confirm measurements. Do not proceed with compromised material.',highlight_component_ids:['base']},
      {index:2,title:'Explore the side arrangement',instructions:'See how the left and right panels relate to the base. This visualization is not a fastening guide.',highlight_component_ids:['left','right']},
      {index:3,title:'Review the inner shelf',instructions:'Inspect the middle panel fit and clearance in the conceptual model.',highlight_component_ids:['middle']},
      {index:4,title:'Review the finished layout',instructions:'Check all dimensions and obtain a safe, independently verified construction plan before physically building.',highlight_component_ids:parts.map(p=>p.id)}
    ],missing_materials:missing,
    safety_note:'Concept visualization only. No verified load capacity, cutting plan, fasteners, or structural safety approval.'
  };
}
/** Deny unknown shapes, huge geometry, invalid positions and missing references; never execute remote code. */
export function validateApprovedScene(raw: unknown): ApprovedScene {
  if (!raw || typeof raw !== 'object') throw Error('Server returned no design.');
  const r = raw as ApprovedScene;
  if (r.status !== 'approved' || r.scene?.units !== 'cm' || r.scene?.origin!=='floor_center') throw Error('Design not approved or unsupported units.');
  if (!Array.isArray(r.scene.components) || r.scene.components.length<1 || r.scene.components.length>35) throw Error('Invalid component count.');
  const ids = new Set<string>();
  for (const p of r.scene.components) {
    if (!p || p.shape!=='box' || typeof p.id!=='string' || p.id.length>64 || ids.has(p.id)) throw Error('Unsupported or duplicate component.');
    ids.add(p.id);
    if (![p.size_cm,p.position_cm,p.rotation_deg].every(a=>Array.isArray(a)&&a.length===3)) throw Error('Invalid scene geometry.');
    if (!p.size_cm.every(n=>finitePositive(n)&&n<=500) || !p.position_cm.every(n=>Number.isFinite(n)&&Math.abs(n)<=500) || !p.rotation_deg.every(n=>Number.isFinite(n)&&Math.abs(n)<=360)) throw Error('Unsafe scene coordinates.');
  }
  if (!Array.isArray(r.assembly_steps) || r.assembly_steps.length>25 || !Array.isArray(r.missing_materials)) throw Error('Invalid steps or supply list.');
  for (const step of r.assembly_steps) if (!Array.isArray(step.highlight_component_ids) || step.highlight_component_ids.some(id=>!ids.has(id))) throw Error('Unknown step component.');
  if (!r.design_name || !r.project_id || typeof r.safety_note!=='string') throw Error('Incomplete design metadata.');
  return r;
}
