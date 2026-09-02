# Student Event & Club Hub

## Local development

**Backend** (`backend/`, .NET 8 + EF Core + PostgreSQL)

```
cd backend
dotnet user-secrets set "ConnectionStrings:DefaultConnection" "<your Neon/Postgres connection string>"
dotnet run
```

The connection string is intentionally **not** stored in `appsettings.json` (it's committed to git). Each developer sets it locally with `dotnet user-secrets`, which stores it outside the repo. Ask a teammate for the Neon connection string.

**Frontend** (`Frontend/`, React + Vite)

```
cd Frontend
cp .env.example .env   # if .env doesn't already exist
npm install
npm run dev
```

## Deploying to Railway

This is a monorepo with two independently deployable apps. Create **two Railway services** from the same GitHub repo, each with its "Root Directory" set accordingly.

### Backend service — root directory: `backend`

Railway will build it from `backend/Dockerfile`. Set these environment variables on the service:

| Variable | Value |
|---|---|
| `ConnectionStrings__DefaultConnection` | Your Postgres connection string (double underscore, not a colon) |
| `FRONTEND_URL` | The deployed frontend's URL (e.g. `https://your-frontend.up.railway.app`), for CORS |

Railway injects `PORT` automatically — the app already binds to it (see `Program.cs`). No `.env` file is needed; Railway env vars are set in the service's **Variables** tab (or via `railway variables --set KEY=VALUE`).

### Frontend service — root directory: `Frontend`

Set this environment variable **before the build runs** (Vite bakes it in at build time):

| Variable | Value |
|---|---|
| `VITE_API_URL` | The deployed backend's URL + `/api` (e.g. `https://your-backend.up.railway.app/api`) |

Build command: `npm install && npm run build`
Start command: `npm run start` (runs `vite preview`, which serves the built `dist/` folder)

### Order of operations

1. Deploy the backend first, note its public URL.
2. Set `VITE_API_URL` on the frontend service to that URL, then deploy the frontend.
3. Set `FRONTEND_URL` on the backend service to the frontend's public URL, then redeploy the backend so CORS allows it.
