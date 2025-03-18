import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import * as AwsUtils from "../utils/AwsUtils.js";
import { WorkflowDeployment } from "../services/WorkflowDeploymentService.js";
import { DynamoDBDocument, PutCommand } from "@aws-sdk/lib-dynamodb";

const DYNAMO_DB_REGION = "eu-central-1";
const DYNAMO_DB_TABLE = "serverless-workflows-table";
const DEPLOYMENT_SK = "DEPLOYMENT";

const client = new DynamoDBClient({
  credentials: AwsUtils.getCredentialProvider(),
  region: DYNAMO_DB_REGION,
});

const docClient = DynamoDBDocument.from(client);

export async function put(workflowDeployment: WorkflowDeployment) {
  const command = new PutCommand({
    TableName: DYNAMO_DB_TABLE,
    Item: {
      PK: workflowDeployment.id,
      SK: DEPLOYMENT_SK,
      json: JSON.stringify(workflowDeployment),
    },
  });

  await docClient.send(command);
}

export async function get(id: string): Promise<WorkflowDeployment | null> {
  const response = await docClient.get({
    TableName: DYNAMO_DB_TABLE,
    Key: {
      PK: id,
      SK: DEPLOYMENT_SK,
    },
  });
  if (response.Item == null) {
    return null;
  }
  const item = response.Item.json;
  return JSON.parse(item) as WorkflowDeployment;
}

export async function remove(id: string) {
  await docClient.delete({
    TableName: DYNAMO_DB_TABLE,
    Key: {
      PK: id,
      SK: DEPLOYMENT_SK,
    },
  });
}
