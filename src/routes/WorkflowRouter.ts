import { Router, Request, Response } from 'express';

const router = Router();

/**
 * PUT /workflow
 * This endpoint simply accepts the incoming JSON payload and logs it.
 */
router.put('/workflow', (req: Request, res: Response) => {
  const workflowDefinition = req.body;
  console.log('Received workflow definition:', workflowDefinition);

  // Respond with a confirmation message along with the received input
  res.status(200).json({
    message: 'Input accepted',
    workflow: workflowDefinition
  });
});

export default router;

// export default router;

// import { Router, Request, Response, NextFunction } from "express";

// // Define interfaces for the expected request body
// interface State {
//   Type: string;
//   Resource: string;
//   Arguments: {
//     FunctionName: string;
//   };
// }

// interface WorkflowRequestBody {
//   Comment: string;
//   StartAt: string;
//   States: Record<string, State>;
// }

// const router = Router();

// router.put("/", (req: Request<{}, {}, WorkflowRequestBody>, res: Response, next: NextFunction) => {
//     const { Comment, StartAt, States } = req.body;

//     // Validate input
//     if (!Comment || typeof Comment !== "string") {
//         return res.status(400).json({ error: "Invalid input. Provide a valid 'Comment'." });
//     }

//     if (!StartAt || typeof StartAt !== "string") {
//         return res.status(400).json({ error: "Invalid input. Provide a valid 'StartAt'." });
//     }

//     if (!States || typeof States !== "object" || Object.keys(States).length === 0) {
//         return res.status(400).json({ error: "Invalid input. Provide a valid 'States' object with tasks." });
//     }

//     // Validate that each state has a 'Type', 'Resource', and 'Arguments.FunctionName' as a valid Lambda ARN
//     for (const stateName in States) {
//         const state = States[stateName];

//         if (!state.Type || typeof state.Type !== "string") {
//             return res.status(400).json({ error: `Invalid input. State '${stateName}' must have a valid 'Type'.` });
//         }

//         if (!state.Resource || state.Resource !== "arn:aws:states:::lambda:invoke") {
//             return res.status(400).json({ error: `Invalid input. State '${stateName}' must have 'Resource' as 'arn:aws:states:::lambda:invoke'.` });
//         }

//         if (
//           !state.Arguments ||
//           !state.Arguments.FunctionName ||
//           !isValidLambdaArn(state.Arguments.FunctionName)
//         ) {
//             return res.status(400).json({ error: `Invalid input. State '${stateName}' must have a valid 'FunctionName' ARN.` });
//         }
//     }

//     // Placeholder response (later will integrate AWS Step Functions)
//     res.json({ message: "Workflow received", Comment });
// });

// // Helper function to validate Lambda ARN format
// function isValidLambdaArn(arn: string): boolean {
//     const arnPattern = /^arn:aws:lambda:[a-z0-9\-]+:[0-9]{12}:function:[\w\-+\/=._]+$/;
//     return arnPattern.test(arn);
// }

// export default router;