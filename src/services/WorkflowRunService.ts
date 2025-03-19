import * as StepFunctionsClient from "../clients/StepFunctionsClient.js";

const ARN_PREFIX = "arn:aws:states:eu-central-1:314146339425:execution";

export class RunDetails {
  workflowId: string;
  runId: string;

  constructor(workflowId: string, runId: string) {
    this.workflowId = workflowId;
    this.runId = runId;
  }

  static fromArn(arn: string): RunDetails {
    const arnSegments = arn.split(":");
    const workflowId = arnSegments.at(-2);
    const runId = arnSegments.at(-1);
    return new RunDetails(workflowId, runId);
  }

  toArn(): string {
    return `${ARN_PREFIX}:${this.workflowId}:${this.runId}`;
  }
}

export async function createExecution(workflowName: string) {
  const executionArn =
    await StepFunctionsClient.createWorkflowRun(workflowName);
  return RunDetails.fromArn(executionArn);
}

export async function getExecution(runDetails: RunDetails) {
  const executionArn = runDetails.toArn();
  return await StepFunctionsClient.getWorkflowRun(executionArn);
}
