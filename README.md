# Create for Assignment 1 - Virtualization and Cloud Computing
# Distributed ML System using Microservices

This assignment implements a distributed microservice-based image classification system using multiple virtual machines.

## Architectre

- Client CM (Ubuntu Desktop) - Web Browser
- Gateway Server (Node.js) - API Gateway
- ML Server (Flask + PyTorch) - Inference Service
- Model Server (Node.js) - Model Repository

## Technology used
- Oracle VirtualBox
- Ubuntu Server / Ubuntu Desktop
- Node.js
- Flask
- PyTorch
- Express.js

## Folder Structure
gateway_server/	-> API Gateway
ml_server/	-> ML Inference Server
model_server/	-> Model Repository
docs/		-> Project Report

## How to Run

1. Start Model Server (port 8000)
2. Start ML Server (port 7000)
3. Start Gateway Server (port 3000)
4. Open browseer from Client VM

## Author
Rajat Chaddhaa 
