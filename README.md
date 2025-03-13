# WorfklowService
Service for creating Serverless Workflows

## Manual push to ECR
1. Login to AWS
```
aws sso login
```
2. Get registry credentials
```
aws ecr get-login-password --region eu-central-1 | docker login --username AWS --password-stdin 314146339425.dkr.ecr.eu-central-1.amazonaws.com
```
3. Build for amd64
```
docker buildx build --platform=linux/amd64 -t devops15/workflow-service .
````
4. Tag with latest
```
docker tag devops15/workflow-service:latest 314146339425.dkr.ecr.eu-central-1.amazonaws.com/devops15/workflow-service:latest
```
5. Push
```
docker push 314146339425.dkr.ecr.eu-central-1.amazonaws.com/devops15/workflow-service:latest
```
