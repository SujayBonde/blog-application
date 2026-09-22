# 🚀 BlogSpace — Complete Deployment Guide (Render + Vercel + Neon DB)

This guide walks you through deploying your full-stack Blog Application to production for **FREE**:
- **Backend (Spring Boot 3 + Java 21)** ➔ **[Render](https://render.com/)**
- **Frontend (React 18 + Vite + Tailwind CSS)** ➔ **[Vercel](https://vercel.com/)**
- **Database (PostgreSQL 18)** ➔ **[Neon Cloud](https://neon.tech/)** (Already connected & active)

---

## 🏗️ Architecture in Production

```text
┌──────────────────────────────┐                 REST API / JWT                ┌──────────────────────────────┐
│       VERCEL (FRONTEND)      │ ─────────────────────────────────────────────►│       RENDER (BACKEND)       │
│  https://your-app.vercel.app │ ◄─────────────────────────────────────────────│  https://your-api.onrender.com│
└──────────────────────────────┘                                               └──────────────┬───────────────┘
                                                                                              │
                                                                                     SSL / JDBC Queries
                                                                                              ▼
                                                                               ┌──────────────────────────────┐
                                                                               │    NEON CLOUD POSTGRESQL     │
                                                                               │      ep-sweet-resonance      │
                                                                               └──────────────────────────────┘
```

---

## 📦 What Has Been Configured For You

1. **Render Cloud Ready**:
   - `backend/Dockerfile`: Multi-stage Docker build using `eclipse-temurin:21` with non-root security.
   - `backend/mvnw`: Maven wrapper generated for native Java buildpacks.
   - `render.yaml`: Infrastructure-as-code Blueprint for automated 1-click deployment.
   - `backend/src/main/resources/application.properties`: Configured with dynamic port `${PORT:8080}` and environment variable overrides.
   - `backend/src/main/java/com/blog/controller/HealthController.java`: Healthcheck endpoints at `/` and `/api/health`.
   - `backend/src/main/java/com/blog/config/CorsConfig.java`: Configured with `*` origin patterns to seamlessly accept requests from `*.vercel.app`.

2. **Vercel Cloud Ready**:
   - `frontend/vercel.json`: Single Page Application (SPA) rewrites to guarantee routes like `/explore` and `/login` never 404 on page refresh.
   - `frontend/src/api/axios.js`: Supports `import.meta.env.VITE_API_BASE_URL` with automatic `/api` suffix normalization.
   - `frontend/.env.example`: Reference configuration for production environment variables.

---

## 🛠️ Step 1: Push Code to GitHub

Make sure your latest code is committed and pushed to your GitHub repository:
```bash
git add .
git commit -m "Configure production deployment for Render and Vercel"
git push origin main
```

---

## 🚀 Step 2: Deploy Backend on Render

### Method A: Web Service (Recommended & Simplest)

1. Sign up / Log in to **[Render.com](https://dashboard.render.com/)**.
2. Click **New +** ➔ **Web Service**.
3. Choose **Build and deploy from a Git repository** and select your GitHub repository.
4. Fill in the deployment details:
   - **Name**: `blogspace-backend` (or any unique name you prefer)
   - **Region**: Any (e.g. `Ohio (US East)` or closest to your Neon DB region)
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Runtime**: Select **`Docker`** *(Recommended: Render will automatically detect `backend/Dockerfile`)*
     - *Alternative if using native Java*: Runtime: `Java`, Build Command: `./mvnw clean package -DskipTests`, Start Command: `java -jar target/app.jar`
   - **Instance Type**: **Free**
5. Expand **Advanced** ➔ **Environment Variables** and add:

| Key | Value |
| :--- | :--- |
| `SPRING_DATASOURCE_URL` | `jdbc:postgresql://ep-sweet-resonance-b4zz7w7f-pooler.c-6.us-east-2.aws.neon.tech/neondb?sslmode=require` |
| `SPRING_DATASOURCE_USERNAME` | `neondb_owner` |
| `SPRING_DATASOURCE_PASSWORD` | `npg_TSXiq3Es4PMZ` |
| `APP_JWT_SECRET` | `404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970` |

6. In **Health Check Path**, enter: `/api/health`.
7. Click **Create Web Service**.
8. Wait ~2–3 minutes for the build to finish. Once live, Render will give you a public URL (e.g. `https://blogspace-backend.onrender.com`).
9. **Test Your Backend**: Open `https://your-backend-name.onrender.com/` in your browser. You should see:
   ```json
   {
     "status": "UP",
     "service": "BlogSpace REST API",
     "cloudDatabase": "Neon PostgreSQL (Connected)",
     "version": "1.0.0"
   }
   ```

---

## 🌐 Step 3: Deploy Frontend on Vercel

1. Sign up / Log in to **[Vercel.com](https://vercel.com/)**.
2. Click **Add New...** ➔ **Project**.
3. Import your GitHub repository.
4. In the configuration screen:
   - **Project Name**: `blogspace`
   - **Framework Preset**: **`Vite`** (automatically detected)
   - **Root Directory**: Click **Edit** and select **`frontend`** *(CRITICAL STEP)*
5. Expand **Environment Variables** and add:

| Key | Value |
| :--- | :--- |
| `VITE_API_BASE_URL` | `https://your-backend-name.onrender.com/api` |

*(Replace `your-backend-name.onrender.com` with your actual Render URL from Step 2)*.

6. Click **Deploy**.
7. Vercel will build and deploy your React app in ~30 seconds and provide a production domain (e.g. `https://blogspace-sujay.vercel.app`).

---

## ✅ Step 4: Verification & Live Test

Once both are deployed:

1. Open your Vercel URL: `https://your-app.vercel.app`.
2. Browse articles loaded live from your cloud Neon PostgreSQL database.
3. Test **Explore** (`/explore`), filtering by categories and tags.
4. Click **Sign In**:
   - **Admin**: `admin@blogspace.com` / `admin123`
   - **Author**: `sujay@gmail.com` / `password123`
   *(Or register a new account on `/register`)*.
5. Create a new article with Markdown and publish it.
6. Verify live comments and like toggles.

---

## 💡 Important Production Notes for Free Tier

- **Render Free Tier Spin-down**: Render's free tier spins down after 15 minutes of inactivity. When a new request arrives, it may take 30–50 seconds for the first cold start to boot up. This is standard behavior for Render's free tier.
- **CORS Handling**: The backend is pre-configured to accept requests from any Vercel preview or production domain automatically without needing manual CORS configuration.
