# CareTrack frontend

## Deploy to Vercel

### Frontend and backend in one Vercel Services project

When deploying the repository's root `vercel.json`, keep the Vercel project's
**Root Directory** at the repository root (blank) and select **Services** as
the framework. The API client defaults to `/api` when `VITE_API` is unset or
empty, so browser requests use the backend service on the same deployment.
You can also set `VITE_API=/api` explicitly.

The root config sends `/api` requests to the backend and other requests to the
frontend. `services.frontend.rewrites` then serves `index.html` for React routes
such as `/register` and `/doctor`. This fallback must be configured for the
frontend service, in addition to the top-level service routing.

See the [Vercel Services guide](https://vercel.com/kb/guide/vercel-services) and
[service rewrite configuration](https://vercel.com/docs/services/config-reference#rewrites).

### Frontend deployed as a separate Vercel project

Use these settings when deploying only the frontend:

- **Root Directory:** `frontend`
- **Framework Preset:** Vite
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Environment Variable:** `VITE_API` set to the deployed backend URL including
  `/api` (for example, `https://your-backend.example.com/api`).

The backend CORS allowlist in `backend/src/app.js` must include the frontend's
deployed origin. Redeploy the backend after changing that allowlist.

`frontend/vercel.json` serves `index.html` for client-side routes so React Router can
handle paths such as `/register`, `/login`, and `/doctor`, including direct
visits and page refreshes. Without this rewrite, Vercel returns `404: NOT_FOUND`
for these paths. See the [Vercel Vite documentation](https://vercel.com/docs/frameworks/frontend/vite#using-vite-to-make-spas).

### Verify the production deployment

Deploy a new build after changing the relevant `vercel.json` or `VITE_API`.
Confirm the production deployment uses the merged commit containing the fix;
a successful preview deployment alone does not update the production domain.
After deployment, open `/register` and `/login` directly and refresh each page. Both should render
the app. After signing in as a doctor, refresh `/doctor` to check the dashboard.

Doctor registration creates the account and opens `/login` with the email
prefilled and a success message. Registration does not sign the doctor in.
Submitting valid credentials signs in and opens `/doctor`; invalid credentials
keep the user on the login page with an error.

## Vite template notes

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and Oxlint's TypeScript related rules in your project.
