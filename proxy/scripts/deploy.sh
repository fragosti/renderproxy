#!/bin/bash

# Terminate if any commands fail
set -e

PROJECT_ID="$(gcloud config get-value project -q)"
SHA=$(git rev-parse HEAD)

gcloud config set compute/zone us-central1-a

echo "Setting image of deployment"
kubectl set image deployment/proxy proxy=gcr.io/${PROJECT_ID}/proxy:${SHA}

echo "Pruning images after deploy"
docker system prune -a