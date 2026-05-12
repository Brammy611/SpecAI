# Deployment Guide (Kubernetes)

Target:
- Namespace: `codecatalyst`
- Domain: `https://codecatalyst.hackathon.sev-2.com`
- Ingress: routes `/` -> frontend, `/api` -> backend
- Database: external Postgres (provided by hackathon)
- LLM: Ollama in-cluster (CPU mode)

## 0) Prerequisites
- Docker installed + logged into Docker Hub (`docker login`).
- kubectl installed.
- Use kubeconfig in this repo:
  - `codecatalyst/kubeconfig.yaml`

All commands below assume you run them from the repo root.

## 1) Build & Push Images
Update tags if you want. This repo manifests use `:v2`.

Frontend:
- `docker build -t beetle1110/specai-frontend:v2 -f docker/frontend.Dockerfile frontend`
- `docker push beetle1110/specai-frontend:v2`

Backend:
- `docker build -t beetle1110/specai-backend:v2 -f docker/backend.Dockerfile backend`
- `docker push beetle1110/specai-backend:v2`

## 2) Create Backend Secret (DATABASE_URL, JWT_SECRET)
IMPORTANT: your DB password contains special characters; URL-encode it before building `DATABASE_URL`.

Format:
- `postgresql://USER:ENCODED_PASSWORD@HOST:PORT/DB_NAME?schema=public`

Create secret:
- `kubectl --kubeconfig=codecatalyst/kubeconfig.yaml -n codecatalyst create secret generic specai-backend-secrets --from-literal=DATABASE_URL='postgresql://USER:ENCODED_PASSWORD@HOST:PORT/DB_NAME?schema=public' --from-literal=JWT_SECRET='CHANGE_ME_LONG_RANDOM'`

If it already exists, delete and recreate:
- `kubectl --kubeconfig=codecatalyst/kubeconfig.yaml -n codecatalyst delete secret specai-backend-secrets`
- (then run the create command again)

## 3) Deploy Ollama (in-cluster)
- `kubectl --kubeconfig=codecatalyst/kubeconfig.yaml apply -f k8s/ollama-service.yaml -f k8s/ollama-deployment.yaml`

Pull models once the pod is running:
- `kubectl --kubeconfig=codecatalyst/kubeconfig.yaml -n codecatalyst get pods | findstr specai-ollama`
- `kubectl --kubeconfig=codecatalyst/kubeconfig.yaml -n codecatalyst exec -it deploy/specai-ollama -- ollama pull gemma3:latest`
- `kubectl --kubeconfig=codecatalyst/kubeconfig.yaml -n codecatalyst exec -it deploy/specai-ollama -- ollama pull nomic-embed-text:latest`

## 4) Deploy Backend + Frontend + Ingress
Apply manifests:
- `kubectl --kubeconfig=codecatalyst/kubeconfig.yaml apply -f k8s/backend-service.yaml -f k8s/backend-deployment.yaml`
- `kubectl --kubeconfig=codecatalyst/kubeconfig.yaml apply -f k8s/frontend-service.yaml -f k8s/frontend-deployment.yaml`
- `kubectl --kubeconfig=codecatalyst/kubeconfig.yaml apply -f k8s/ingress.yaml`

## 5) Verify
- `kubectl --kubeconfig=codecatalyst/kubeconfig.yaml -n codecatalyst get pods,svc,ing`

Backend logs:
- `kubectl --kubeconfig=codecatalyst/kubeconfig.yaml -n codecatalyst logs deploy/specai-backend`

Ollama logs:
- `kubectl --kubeconfig=codecatalyst/kubeconfig.yaml -n codecatalyst logs deploy/specai-ollama`

Check endpoints:
- Frontend: `https://codecatalyst.hackathon.sev-2.com/`
- Backend: `https://codecatalyst.hackathon.sev-2.com/api/`

## Notes
- Ollama uses `emptyDir`, so models will be re-downloaded if the pod is rescheduled.
- Backend runs `npx prisma migrate deploy` via initContainer on startup.
