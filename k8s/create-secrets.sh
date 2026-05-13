#!/bin/bash
# =============================================================
# create-secrets.sh
# Create/update the Kubernetes secret for the SpecAI backend.
#
# Usage:
#   export OLLAMA_TUNNEL_URL="https://xxxxxxxx.lhr.life"
#   export GITHUB_TOKEN="github_pat_..."
#   export GEMINI_API_KEY="AIza..."
#   export DATABASE_URL="postgresql://..."
#   export JWT_SECRET="your-jwt-secret"
#   bash create-secrets.sh
# =============================================================

NAMESPACE="codecatalyst"

kubectl delete secret specai-backend-secrets -n "$NAMESPACE" --ignore-not-found

kubectl create secret generic specai-backend-secrets \
  --namespace="$NAMESPACE" \
  --from-literal=DATABASE_URL="${DATABASE_URL}" \
  --from-literal=JWT_SECRET="${JWT_SECRET}" \
  --from-literal=OLLAMA_BASE_URL="${OLLAMA_TUNNEL_URL}" \
  --from-literal=GITHUB_TOKEN="${GITHUB_TOKEN}" \
  --from-literal=GEMINI_API_KEY="${GEMINI_API_KEY}"

echo ""
echo "✅ Secret 'specai-backend-secrets' created in namespace '$NAMESPACE'"
echo "   OLLAMA_BASE_URL = $OLLAMA_TUNNEL_URL"
echo ""
echo "Now apply the deployment:"
echo "   kubectl apply -f k8s/backend-deployment.yaml"
