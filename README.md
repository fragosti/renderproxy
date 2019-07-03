# Prerender.dev

# Google cloud set up

Install the [Google Cloud SDK](https://cloud.google.com/sdk/docs/quickstarts), which includes the gcloud command-line tool.
Using the gcloud command line tool, install the Kubernetes command-line tool. kubectl is used to communicate with Kubernetes, which is the cluster orchestration system of GKE clusters:

```
gcloud components install kubectl
```

To save time typing your project ID and Compute Engine zone options in the gcloud command-line tool, you can set the defaults:

```
gcloud auth login
gcloud auth configure-docker

gcloud config set project [PROJECT_ID]
gcloud config set compute/zone us-central1-b
```
