#!/bin/bash

# Terminate if any commands fail
set -e


PROJECT_ID="$(gcloud config get-value project -q)"
TIMESTAMP=$(date +%s)

echo "Building image"
docker build -t gcr.io/${PROJECT_ID}/proxy:${TIMESTAMP} .

echo "Pushing image up to GCR"
docker push gcr.io/${PROJECT_ID}/proxy:${TIMESTAMP}

echo "Setting image of deployment"
kubectl set image deployment/proxy proxy=gcr.io/${PROJECT_ID}/proxy:${TIMESTAMP}

echo "Pruning images after deploy"
docker system prune -a