/**
 * WorkflowTransformeService.ts
 *
 * This module exports a function to transform a simplified workflow input
 * into the AWS StateMachine accepted format. It adds the required "Resource",
 * "Retry" properties to each state, and also sets the "QueryLanguage" field.
 */

/* --- Interfaces for the simplified input --- */
export interface NewState {
    Type: string;
    Arguments: any;
    Next?: string;
    End?: boolean;
  }

  export interface NewWorkflowInput {
    Comment: string;
    StartAt: string;
    States: { [stateName: string]: NewState };
  }

  /* --- Interfaces for the AWS accepted output --- */
  export interface RetryConfiguration {
    ErrorEquals: string[];
    IntervalSeconds: number;
    MaxAttempts: number;
    BackoffRate: number;
    JitterStrategy: string;
  }

  export interface AWSState extends NewState {
    Resource: string;
    Retry: RetryConfiguration[];
  }

  export interface AWSWorkflow {
    Comment: string;
    StartAt: string;
    States: { [stateName: string]: AWSState };
    QueryLanguage: string;
  }

  /* --- Constants used in the transformation --- */
  const defaultResource = "arn:aws:states:::lambda:invoke";

  const defaultRetry: RetryConfiguration[] = [
    {
      ErrorEquals: [
        "Lambda.ServiceException",
        "Lambda.AWSLambdaException",
        "Lambda.SdkClientException",
        "Lambda.TooManyRequestsException"
      ],
      IntervalSeconds: 1,
      MaxAttempts: 3,
      BackoffRate: 2,
      JitterStrategy: "FULL"
    }
  ];

  /* --- Transformation Function --- */
  export function transformWorkflow(input: NewWorkflowInput): AWSWorkflow {
    const transformedStates: { [stateName: string]: AWSState } = {};

    for (const [stateName, state] of Object.entries(input.States)) {
      transformedStates[stateName] = {
        ...state,
        Resource: defaultResource,
        Retry: defaultRetry
      };
    }

    return {
      Comment: input.Comment,
      StartAt: input.StartAt,
      States: transformedStates,
      QueryLanguage: "JSONata"
    };
  }
