import {
  SFNClient,
  CreateStateMachineCommand,
  CreateStateMachineCommandInput,
  DeleteStateMachineCommand,
  DescribeStateMachineCommand,
  ListStateMachinesCommand
} from "@aws-sdk/client-sfn";
import * as AwsUtils from "../utils/AwsUtils.js";
import dotenv from "dotenv";

dotenv.config();

// coming from .env file (.gitignored)
const LAMBDA_REGION = "eu-central-1";
const ROLE_ARN = "arn:aws:iam::314146339425:role/StepFunctionCreateExecute";
const AWS_ACCOUNT = "314146339425";

// Creating a client and accesing credentials
const stepFunctionsClient = new SFNClient({
  region: LAMBDA_REGION,
  credentials: AwsUtils.getCredentialProvider(),
});

// Unique Name Generation
function generateStateMachineName(): string {
    const timestamp = Date.now();
    return `Workflow-${timestamp}`;
  }

// Create Workflow
export async function createWorkflow(workflowDefinition): Promise<any> {

  // Build parameters for creating the state machine.
  const params: CreateStateMachineCommandInput = {
    name: generateStateMachineName(),
    definition: JSON.stringify(workflowDefinition),
    roleArn: ROLE_ARN,
  };

  const command = new CreateStateMachineCommand(params);
  const response = await stepFunctionsClient.send(command);
  console.log("State machine created successfully:", response);
  return response;
}

// List all existing workflows
export async function getWorkflows(): Promise<string[]> {
  const command = new ListStateMachinesCommand({});
  const data = await stepFunctionsClient.send(command);

  // Catches the case when state machine is undefined (required)
  return (data.stateMachines || [])
  .map(sm => sm.name)
  // handles potential undefined values (required)
  .filter((name): name is string => name !== undefined);

}

// Delete existing workflows
export async function deleteWorkflow(workflowName: string) {
  // Build ARN of the machine
  const stateMachineArn = `arn:aws:states:${LAMBDA_REGION}:${AWS_ACCOUNT}:stateMachine:${workflowName}`;
  const command = new DeleteStateMachineCommand({ stateMachineArn });
  await stepFunctionsClient.send(command);
  console.log(`Workflow ${workflowName} deleted successfully`);
}

// Get Workflow (State Machine) Description (json) from AWS
export async function getWorkflowDescription(workflowName: string) {
  // Build ARN of the machine
  const stateMachineArn = `arn:aws:states:${LAMBDA_REGION}:${AWS_ACCOUNT}:stateMachine:${workflowName}`;
  const command = new DescribeStateMachineCommand({ stateMachineArn });
  const response = await stepFunctionsClient.send(command);
  return JSON.parse(response.definition);
}