import {
  Architecture,
  CreateFunctionCommand,
  PublishLayerVersionCommand,
  PublishLayerVersionCommandInput,
  LambdaClient,
  PackageType,
  Runtime,
  DeleteFunctionCommand,
} from "@aws-sdk/client-lambda";
import * as AwsUtils from "../utils/AwsUtils.js";

const LAMBDA_REGION = "eu-central-1";
const LOGGING_ROLE_ARN =
  "arn:aws:iam::314146339425:role/LambdaBasicExecutionRole";
const SOURCE_CODE_S3_BUCKET =
  "module-bucket-a60555b5-a452-46d5-8a9f-5248d2dc41a5";

const client = new LambdaClient({
  credentials: AwsUtils.getCredentialProvider(),
  region: LAMBDA_REGION,
});

export async function deleteLambda(lambdaName: string) {
  const input = {
    // DeleteFunctionRequest
    FunctionName: lambdaName,
  };
  const command = new DeleteFunctionCommand(input);
  await client.send(command);
}

export async function createLambda(
  s3Key: string,
  lambdaName: string,
  layerArn: string,
) {
  const command = new CreateFunctionCommand({
    Code: {
      S3Bucket: SOURCE_CODE_S3_BUCKET,
      S3Key: s3Key,
    },
    Publish: true,
    Layers: [layerArn],
    FunctionName: lambdaName,
    Role: LOGGING_ROLE_ARN,
    Architectures: [Architecture.x86_64],
    Handler: "lambda_function.lambda_handler",
    PackageType: PackageType.Zip,
    Runtime: Runtime.python311,
  });

  const { FunctionArn } = await client.send(command);
  return FunctionArn;
}

export async function publishLayer(layerKey: string, layerName: string) {
  const input: PublishLayerVersionCommandInput = {
    LayerName: layerName,
    Description: "Automatically created layer for serverless workflows",
    Content: {
      S3Bucket: SOURCE_CODE_S3_BUCKET,
      S3Key: layerKey,
    },
    CompatibleArchitectures: [Architecture.x86_64],
    CompatibleRuntimes: [Runtime.python311],
  };

  const command = new PublishLayerVersionCommand(input);
  return client.send(command);
}
