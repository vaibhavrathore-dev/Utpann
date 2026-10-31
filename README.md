# RAY — Reimagine Reusable Materials

RAY is an AI-assisted Android application that helps users transform reusable materials into useful design concepts using computer vision, 3D visualization, and augmented reality.

## Features

- Space measurement input
- Reusable material inventory
- AI-assisted material analysis
- Parametric 3D design generation
- Interactive 3D model preview
- Augmented reality placement
- Assembly-step visualization
- Supabase authentication

## Technology Stack

| Component | Technology |
|-----------|------------|
| Android App | React Native, Expo, TypeScript |
| 3D and AR | ViroReact, ARCore |
| Backend | Python, FastAPI, Pydantic |
| AI Model | Qwen3-VL |
| Local AI Runtime | Ollama |
| 3D Geometry | Trimesh, GLB |
| Authentication | Supabase Auth |
| Local Database | SQLite |

## Project Structure

ray-android-mvp/ - React Native Android application
backend/ - FastAPI, AI integration and 3D generation
docs/ - API contracts and documentation

## How It Works

1. Enter the available space dimensions.
2. Provide reusable material details.
3. Optionally upload an image for AI material analysis.
4. Generate a design using validated material dimensions.
5. Inspect the generated 3D model.
6. Visualize the design in augmented reality.

## Current MVP

The current prototype supports a constrained wooden mini-shelf design template.

Qwen3-VL assists with material understanding. The backend generates validated parametric geometry rather than arbitrary AI-generated meshes.

Design outputs are conceptual and are not structural safety certifications.

## Local Development

### Backend

Install the Python dependencies from backend/requirements-dev.txt.

Copy backend/.env.example to backend/.env and configure the required settings.

Run:

python -m uvicorn app.main:app --host 127.0.0.1 --port 8000

### Android

cd ray-android-mvp
npm install
npx expo start --dev-client

For USB-connected Android development:

adb reverse tcp:8000 tcp:8000
adb reverse tcp:8081 tcp:8081

Configure .env.local with the FastAPI URL and Supabase public configuration.

A native Android development build is required for ViroReact.

## Security

Never commit local .env files, credentials, secret API keys, generated private files, or AI model weights.

## Team

Built collaboratively for the hackathon.

## Vision

From reusable materials to useful creations — powered by AI and augmented reality.
