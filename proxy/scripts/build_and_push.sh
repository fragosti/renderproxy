#!/bin/bash

# Terminate if any commands fail
set -e

PROJECT_ID="$(gcloud config get-value project -q)"
SHA=$(git rev-parse HEAD)

gcloud config set compute/zone us-central1-a

echo "Building image"
docker build -t gcr.io/${PROJECT_ID}/proxy:${SHA} -t gcr.io/${PROJECT_ID}/proxy:latest .

echo "Pushing image up to GCR"
docker push gcr.io/${PROJECT_ID}/proxy:${SHA}
