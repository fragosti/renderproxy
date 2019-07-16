#!/bin/bash

# Terminate if any commands fail
set -e

PROJECT_ID="$(gcloud config get-value project -q)"
TIMESTAMP=$(date +%s)

gcloud config set compute/zone us-west1-a
gcloud container clusters get-credentials api

echo "Building image"
docker build -t gcr.io/${PROJECT_ID}/api:${TIMESTAMP} .

echo "Pushing image up to GCR"
docker push gcr.io/${PROJECT_ID}/api:${TIMESTAMP}

echo "Setting image of deployment"
kubectl set image deployment/api api=gcr.io/${PROJECT_ID}/api:${TIMESTAMP}

echo "Pruning images after deploy"
docker system prune -a