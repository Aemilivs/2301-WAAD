#!/bin/bash

# Install kubectl if not present
if ! command -v kubectl &>/dev/null; then
  echo "Installing kubectl..."
  curl -LO https://storage.googleapis.com/kubernetes-release/release/$(curl -s https://storage.googleapis.com/kubernetes-release/release/stable.txt)/bin/linux/amd64/kubectl
  chmod +x ./kubectl
  sudo mv ./kubectl /usr/local/bin/kubectl
else
  echo "kubectl is already installed."
fi
kubectl version --client

# Install Minikube if not present
if ! command -v minikube &>/dev/null; then
  echo "Installing Minikube..."
  curl -Lo minikube https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64
  chmod +x minikube
  sudo mv minikube /usr/local/bin/
else
  echo "Minikube is already installed."
fi
minikube version

# Start Minikube
minikube start

# Enable Minikube addons
minikube addons enable ingress
minikube addons enable metrics-server

# Build Docker image
eval $(minikube docker-env)
docker build -t my-express-app:latest ./API

# Apply Kubernetes manifests
kubectl apply -f k8s-deployment.yaml

# Wait for the deployment to be ready
kubectl rollout status deployment my-express-app

# Open the application in the default web browser
minikube service my-express-app
