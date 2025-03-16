import * as LambdaClient from "../clients/LambdaClient.js";
import { WorkflowDeployment } from "../schemas/WorkflowDeploymentSchema.js";

const LAYER_POSTFIX = "-layer.zip";

export class DeploymentInfo {
  functions: string[];

  constructor(functions: string[]) {
    this.functions = functions;
  }
}

export async function createDeployment(deployment: WorkflowDeployment) {
  const layerArn = await deployLayer(deployment);
  const arns = await deployLambdas(deployment, layerArn);
  return new DeploymentInfo(arns);
}

async function deployLambdas(deployment: WorkflowDeployment, layerArn: string) {
  const lambdas = deployment.modules.filter(
    (path) => !path.endsWith(LAYER_POSTFIX),
  );

  const arns: string[] = [];
  for (const s3key of lambdas) {
    const lambdaName = s3key.split(".").at(0).replaceAll("/", "_");
    await LambdaClient.deleteLambda(lambdaName);
    const arn = await LambdaClient.createLambda(s3key, lambdaName, layerArn);
    arns.push(arn);
  }
  return arns;
}

async function deployLayer(deployment: WorkflowDeployment) {
  const layers = deployment.modules.filter((path) =>
    path.endsWith(LAYER_POSTFIX),
  );

  if (layers.length != 1) {
    throw Error("Layers count should be 1");
  }
  const [layerKey] = layers;
  const layerName = layerKey.split(".").at(0).replaceAll("/", "_");

  const { LayerVersionArn } = await LambdaClient.publishLayer(
    layerKey,
    layerName,
  );
  return LayerVersionArn;
}
