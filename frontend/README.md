# CareTrack frontend

## Deploy to Vercel

Use these Vercel project settings:

- **Root Directory:** `frontend`
- **Framework Preset:** Vite
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Environment Variable:** `VITE_API` set to the deployed backend URL including
  `/api` (for example, `https://your-backend.example.com/api`).

The backend CORS allowlist in `backend/src/app.js` must include the frontend's
deployed origin. Redeploy the backend after changing that allowlist.

`vercel.json` serves `index.html` for client-side routes so React Router can
handle paths such as `/register`, `/login`, and `/doctor`, including direct
visits and page refreshes. Without this rewrite, Vercel returns `404: NOT_FOUND`
for these paths. See the [Vercel Vite documentation](https://vercel.com/docs/frameworks/frontend/vite#using-vite-to-make-spas).

Deploy a new build after changing `vercel.json` or `VITE_API`. After deployment,
open `/register` and `/login` directly and refresh each page. Both should render
the app. After signing in as a doctor, refresh `/doctor` to check the dashboard.

## Vite template notes

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and Oxlint's TypeScript related rules in your project.
