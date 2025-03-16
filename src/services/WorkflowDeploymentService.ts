import * as LambdaClient from "../clients/LambdaClient.js";
import { WorkflowDeploymentRequest } from "../schemas/WorkflowDeploymentRequestSchema.js";
import * as WorkflowDeploymentDynamoClient from "../clients/WorkflowDeploymentDynamoClient.js";
import { v4 as uuidv4 } from "uuid";

const LAYER_POSTFIX = "-layer.zip";

export class ResourceDefiniton {
  arn: string;
  name: string;

  constructor(arn: string, name: string) {
    this.arn = arn;
    this.name = name;
  }
}

export class WorkflowDeployment {
  id: string;
  functions: ResourceDefiniton[];
  layer: ResourceDefiniton;

  constructor(
    id: string,
    functions: ResourceDefiniton[],
    layer: ResourceDefiniton,
  ) {
    this.id = id;
    this.functions = functions;
    this.layer = layer;
  }
}

export class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "Not found error";
  }
}

export async function createDeployment(deployment: WorkflowDeploymentRequest) {
  const deploymentId = uuidv4();
  const layerResourceDefinition = await deployLayer(deployment);
  const { arn: layerArn } = layerResourceDefinition;
  const lambdaResourceDefinitions = await deployLambdas(deployment, layerArn);
  const workflowDeployment = new WorkflowDeployment(
    deploymentId,
    lambdaResourceDefinitions,
    layerResourceDefinition,
  );
  await WorkflowDeploymentDynamoClient.put(workflowDeployment);
  return workflowDeployment;
}

export async function deleteDeployment(id: string) {
  const deployment = await getDeployment(id);
  if (deployment === null) {
    throw new NotFoundError("Deployment not found");
  }
  for (const fn of deployment.functions) {
    const lambdaName = fn.arn.split(":").at(-1);
    await LambdaClient.deleteLambda(lambdaName);
  }
  await WorkflowDeploymentDynamoClient.remove(id);
}

export async function getDeployment(id: string) {
  return await WorkflowDeploymentDynamoClient.get(id);
}

async function deployLambdas(
  deployment: WorkflowDeploymentRequest,
  layerArn: string,
) {
  const lambdas = deployment.modules.filter(
    (path) => !path.endsWith(LAYER_POSTFIX),
  );

  const resourceDefinitions: ResourceDefiniton[] = [];
  for (const s3key of lambdas) {
    const lambdaName = uuidv4();
    const arn = await LambdaClient.createLambda(s3key, lambdaName, layerArn);

    const lambdaHumanReadableName = s3key.split(".").at(0).split("/").at(-1);
    resourceDefinitions.push(
      new ResourceDefiniton(arn, lambdaHumanReadableName),
    );
  }
  return resourceDefinitions;
}

async function deployLayer(deployment: WorkflowDeploymentRequest) {
  const layers = deployment.modules.filter((path) =>
    path.endsWith(LAYER_POSTFIX),
  );

  if (layers.length != 1) {
    throw Error("Layers count should be 1");
  }
  const [layerKey] = layers;
  const layerHumanReadableName = layerKey.split(".").at(0).split("/").at(-1);
  const layerName = uuidv4();
  const { LayerVersionArn } = await LambdaClient.publishLayer(
    layerKey,
    layerName,
  );

  return new ResourceDefiniton(LayerVersionArn, layerHumanReadableName);
}
