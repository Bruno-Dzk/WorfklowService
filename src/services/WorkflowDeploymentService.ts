import * as LambdaClient from "../clients/LambdaClient.js";
import { WorkflowDeployment } from "../schemas/WorkflowDeploymentSchema.js";

const LAYER_POSTFIX = "-layer.zip";

export async function createDeployment(deployment: WorkflowDeployment) {
  const layerArn = await deployLayer(deployment);
  await deployLambdas(deployment, layerArn);
}

async function deployLambdas(deployment: WorkflowDeployment, layerArn: string) {
  const lambdas = deployment.modules.filter(
    (path) => !path.endsWith(LAYER_POSTFIX),
  );

  for (const s3key of lambdas) {
    const lambdaName = s3key.split(".").at(0).replaceAll("/", "_");
    const response = await LambdaClient.createLambda(
      s3key,
      lambdaName,
      layerArn,
    );
    console.log(response);
  }
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
