import {
  SFNClient,
  CreateStateMachineCommand,
  CreateStateMachineCommandInput,
  DeleteStateMachineCommand,
  DescribeStateMachineCommand
} from "@aws-sdk/client-sfn";
import * as AwsUtils from "../utils/AwsUtils.js";

// coming from .env file (.gitignored)
const LAMBDA_REGION = "eu-central-1";
const ROLE_ARN = "arn:aws:iam::314146339425:role/StepFunctionCreateExecute";
const AWS_ACCOUNT = "314146339425";

// Configure the Step Functions client.
const stepFunctionsClient = new SFNClient({
    credentials: AwsUtils.getCredentialProvider(),
    region: LAMBDA_REGION,
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

  try {
    const command = new CreateStateMachineCommand(params);
    const response = await stepFunctionsClient.send(command);
    console.log("State machine created successfully:", response);
    return response;
  } catch (error) {
    console.error("Error creating state machine:", error);
    throw error;
  }
}

export async function deleteWorkflow(workflowName: string) {
    try {
        const stateMachineArn = `arn:aws:states:${LAMBDA_REGION}:${AWS_ACCOUNT}:stateMachine:${workflowName}`;

        const command = new DeleteStateMachineCommand({ stateMachineArn });
        await stepFunctionsClient.send(command);

        console.log(`Workflow ${workflowName} deleted successfully`);
        return { message: `Workflow ${workflowName} deleted successfully` };
    } catch (error: any) {
        console.error("Error deleting workflow:", error);
        throw new Error(error.message);
    }
}

// Get Workflow (State Machine) Description (json) from AWS
export async function getWorkflowDescription(workflowName: string) {
  try {
      const stateMachineArn = `arn:aws:states:${LAMBDA_REGION}:${AWS_ACCOUNT}:stateMachine:${workflowName}`;

      const command = new DescribeStateMachineCommand({ stateMachineArn });
      const response = await stepFunctionsClient.send(command);

      return JSON.parse(response.definition);
  } catch (error: any) {
      console.error("Error fetching state machine details:", error);
      throw new Error(error.message);
  }
}