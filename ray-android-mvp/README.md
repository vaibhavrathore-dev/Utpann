# RAY — Mobile-first AR Creation Studio / MVP 0.1

**Android-native React Native + TypeScript + Expo Router + ViroReact.** This is **not** a Next.js or Three.js web app. The ArtCraft screen recording guided the editorial dark motion layout, layered orbiting image cards, responsive touch states, and progressive screen transitions. The product name is **RAY**.

## Delivered screens

1. **Home** — mobile-only cinematic orbit card hero, animated layered product imagery and interactive section cards.
2. **Space** — camera preview with runtime permission, plus confirmed manual width/height/depth in centimeters (no fake AR measurement).
3. **Materials** — photo capture/selection (10 MB cap where the picker reports file size), quantity/board dimensions/condition validation.
4. **Reimagine** — clearly labeled **offline deterministic demonstration** if no backend base URL is configured; live `fetch` integration seam if configured.
5. **3D Studio** — Viro3DSceneNavigator showing 5 box parts in real-world meter scale, rotation gestures/buttons and four interactive assembly stages.
6. **AR** — ViroReact ARCore camera with plane selection, anchored shelf scene and assembly UI, **requires real supported phone and native development build**.
7. **AR Test** — independent 10-cm cube on a tracked horizontal plane (milestone M0).
8. **Projects** — current session, AR test entry; not cloud persistence.

### Important truth-in-demo labels

- The included scene is a **geometry fixture, not AI-generated and not a verified construction plan**. The input-driven dimensions are constrained to one simple organizer type.
- RAY does not estimate a room's dimensions from a normal 2D camera photo. **Space screen uses manual entry**, with camera preview for visual context only.
- AR uses *native tracked plane selection*, not a fake background-camera image overlay. **Physical ARCore testing remains required**.
- The FastAPI route `POST /api/v1/reimagine/plan` is a **proposed contract**. It may differ from Vaibhav's actual backend; coordinate before enabling live mode.
- Live responses are strictly validated for supported box shapes and cm-space transforms. No AI-generated JavaScript is executed.
- The phone never connects to Qwen directly; only the team's FastAPI server (Qwen stays on Sandeep's machine).

## Versions / compatibility

Based on the official [ReactVision Expo TypeScript starter](https://github.com/ReactVision/expo-starter-kit-typescript) and its Expo 57 + React Native 0.86 + ViroReact compatibility guidance. SDK 57 is intentional: do **not** casually upgrade to SDK 58 until the native ViroReact stack is revalidated. Dependencies may be aligned with `npx expo install --fix` if the Expo doctor reports a mismatch, but **keep the Expo SDK major at 57**.

## Windows: install and build

**Requirements:** Node 22+ (your existing Node v24 is fine), Android SDK + a configured Android phone with USB debugging, ARCore-supported device, Google Play Services for AR where required. Alternatively use a suitable EAS development build.

In PowerShell, from the extracted `ray-android-mvp` directory:

```powershell
npm install --include=optional
npx expo-doctor
npx expo prebuild --platform android --clean
npx expo run:android --device
npx expo start --dev-client
```

**NOT** `npx expo start --go`: ViroReact native AR will not run in Expo Go. If Windows local Android compilation is unavailable, configure Expo EAS to produce a development APK then install it on the phone.

### First device test

1. Launch the installed **RAY** app on the phone.
2. Open the top-right studio button → **Launch AR cube check**.
3. Slowly point at a real table/floor in good lighting; wait for plane overlay; tap to place 10 cm cube.
4. Move around and confirm that it remains anchored. **If M0 fails, stop and debug native compatibility before AI integration.**
5. Then try **Start creating → Space → Materials → Reimagine → 3D Preview → AR**.

### Live backend (optional after contract is confirmed)

Copy `.env.example` to `.env` and set:

```env
EXPO_PUBLIC_RAY_API_BASE_URL=http://192.168.14.173
```

Use your **real backend computer's LAN IP**; never `localhost` on a phone. The current implementation accepts JSON (no photos) or multipart with a `metadata` string and image files in `images`, which is a **proposal only**. The server must return the schema defined in `src/domain/scene.ts` with `status: "approved"`; malformed or unapproved scenes are rejected.

## Main files

```
app/index.tsx           / animated touch-first landing
app/space.tsx           / manual confirmed dimensions, optional camera preview
app/materials.tsx       / photo input + material details
app/results.tsx         / asynchronous proposed backend / offline fixture
app/preview.tsx         / Viro native 3D model and part controls
app/ar.tsx              / tracked surface placement (requires device)
app/ar-test.tsx         / critical M0 cube hardware test
src/ar/Scenes.tsx       / 3D renderer and AR scene
src/ar/ARCube.tsx       / minimal native test scene
src/domain/scene.ts     / centimeter geometry, safety validation
src/services/reimagineApi.ts / network / demo isolation
src/state/Project.tsx   / session state
```

## Status / QA disclosure

The code, bundled imagery, JSON configuration and JS/TSX syntax have been inspected in the creation environment. The creation environment **cannot fetch npm dependencies or access a physical Android device**, so **no APK, successful native build, ARCore placement test or production compilation is claimed**. Physical testing and device-specific compatibility are the immediate next steps.

## Scope

One mobile-optimized material-aware creator journey. No unverified payment, marketplace transaction, AI scene generation or safety claims. No old UTPANN web app is overwritten.
