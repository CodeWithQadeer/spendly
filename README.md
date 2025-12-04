# Spendly – Smart Expenses

Spendly is a full‑stack personal finance app for tracking income and expenses, managing budgets, and viewing insights.

This repo contains both the **frontend (React + Vite)** and **backend (Node + Express + MongoDB)**.

---

## Project structure

```text
spendly/
  spendly-frontend/   # React + Vite client
  spendly-backend/    # Express + MongoDB API
```

### Frontend (spendly-frontend)

- React 19 + Vite
- Redux Toolkit for state management (`auth`, `balance`, `transactions`, `loan` slices)
- Tailwind CSS 4 for styling + custom theme toggle (light/dark)
- React Router for routing
- Google OAuth via `@react-oauth/google`

### Backend (spendly-backend)

- Node.js + Express
- MongoDB via Mongoose
- JWT authentication
- Google login using `google-auth-library`
- Security middleware: Helmet, rate limiting, CORS

---

## Prerequisites

- Node.js (LTS)
- npm
- MongoDB running locally (default connection: `mongodb://127.0.0.1:27017/spendly_db`)

---

## Backend setup (API)

From the repo root:

```bash
cd spendly-backend
npm install
```

### Environment variables

`spendly-backend/.env` (already present) looks like:

```env
MONGO_URI=mongodb://127.0.0.1:27017/spendly_db
JWT_SECRET=supersecretkey123
PORT=3033
GOOGLE_CLIENT_ID=412313270118-8h81q975kmcsd1ur45ke180cif9t00l4.apps.googleusercontent.com
NODE_ENV=development
# Optional: override allowed frontend origins (comma‑separated)
# CLIENT_ORIGIN=http://localhost:5173
```

> **Note**: Change `JWT_SECRET` and `GOOGLE_CLIENT_ID` to your own secure values in any real deployment.

### Running the backend

```bash
cd spendly-backend
npm run dev       # uses nodemon
# or
npm start         # plain node server.js
```

The API will be available at `http://localhost:3033` by default.

---

## Frontend setup (client)

From the repo root:

```bash
cd spendly-frontend
npm install
```

### Environment variables

`spendly-frontend/.env` (already present) looks like:

```env
VITE_GOOGLE_CLIENT_ID=412313270118-8h81q975kmcsd1ur45ke180cif9t00l4.apps.googleusercontent.com
VITE_API_BASE_URL=http://localhost:3033
```

Make sure `VITE_GOOGLE_CLIENT_ID` matches the backend `GOOGLE_CLIENT_ID` and is configured in the Google Cloud Console with the origin:

```text
http://localhost:5173
```

### Running the frontend

```bash
cd spendly-frontend
npm run dev
```

Vite will start the app at `http://localhost:5173`.

---

## Theme toggle

- The app has a **manual light/dark theme toggle** in the navbar.
- Theme is stored in `localStorage` under the key `spendly-theme` and applied by adding/removing a `dark` class on the `<body>`.
- It **does not** automatically follow the system/OS theme.

---

## Google login

- Google login is implemented using the **Google Identity Services** button on the frontend and the `/auth/google` route on the backend.
- On successful login, the backend issues a JWT stored as `auth-token` in `localStorage`.

To make Google login work in development, ensure:

1. The OAuth client ID is the same in both `.env` files.
2. In Google Cloud Console, the OAuth client has this **Authorized JavaScript origin**:
   
   ```text
   http://localhost:5173
   ```

If the console shows `The given origin is not allowed for the given client ID.`, double‑check this configuration.

---

## CORS configuration

The backend uses a small CORS allow‑list in `server.js`:

- Allowed origins come from `CLIENT_ORIGIN` (comma‑separated) or default to `http://localhost:5173`.
- Preflight (OPTIONS) requests are handled for all routes.

If you change the frontend URL (e.g. different port or deployed domain), update `CLIENT_ORIGIN` in `spendly-backend/.env`.

---

## Useful scripts

### Backend

From `spendly-backend`:

- `npm run dev` – start API with nodemon
- `npm start` – start API with node

### Frontend

From `spendly-frontend`:

- `npm run dev` – start Vite dev server
- `npm run build` – production build
- `npm run preview` – preview the built app

---

## Notes & TODOs

- Add tests for critical flows (auth, transactions, recurring payments).
- Replace placeholder secrets and Mongo URI with environment‑specific values before deploying.
- Expand `spendly-frontend/README.md` (currently the default Vite template) or consolidate docs here as the single source of truth.
