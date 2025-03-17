import { Router, Request, Response } from 'express';
import { createWorkflow, deleteWorkflow, getWorkflowDescription } from '../controllers/WorkflowController.js';
import AWS from 'aws-sdk';

 const router = Router();
 const stepfunctions = new AWS.StepFunctions();

 /**
  * PUT /workflow
  * This endpoint simply accepts the incoming JSON payload and logs it.
  */

 router.put('/', async(req: Request, res: Response) => {
    console.log("PUT /workflow called");
    try{
        const workflowDefinition = req.body;

        // VALIDATION MISSING, add later

        const result = await createWorkflow(workflowDefinition)

        res.status(201).json({
            message: 'Workflow created successfully',
            data: result
        });

    } catch (error) {
        console.error('Error creating workflow', error)
        res.status(500).json({
            message: 'Error creating workflow',
            error: error instanceof Error ? error.message : error
        });
    }
});

router.get('/', async(req: Request, res: Response) => {
    console.log("GET /workflow called");
    try {
        // List state machines using AWS Step Functions API
        const data = await stepfunctions.listStateMachines().promise();
        // Extract the state machine names
        const stateMachineNames = data.stateMachines.map(sm => sm.name);
        res.status(200).json({ stateMachines: stateMachineNames });
    } catch (error) {
        console.error('Error listing state machines:', error);
        res.status(500).json({
            message: 'Error listing state machines',
            error: error instanceof Error ? error.message : error
        });
    }
  });

  router.delete('/:workflowName', async (req: Request, res: Response) => {
    const { workflowName } = req.params;
    console.log(`DELETE /${workflowName} called`);

    try {
        // Creating ARN of the state machine
        await deleteWorkflow(workflowName)

        res.status(200).json({ message: `Workflow ${workflowName} deleted successfully from AWS` });

    }catch (error: any) {
        console.error("Error deleting workflow:", error);
        res.status(500).json({ message: error.message || "Internal Server Error" });
    }

    });

  router.get('/:workflowName', async(req: Request, res: Response) => {
    const { workflowName } = req.params;
    console.log(`GET /${workflowName} called`);

    try {
        const stateMachineDetails = await getWorkflowDescription(workflowName);
        res.status(201).json(stateMachineDetails);
    } catch (error) {
        console.error('Error returning workflow description:', error);
        res.status(500).json({
            message: 'Error returning workflow description',
            error: error instanceof Error ? error.message : error
        });
    }
  });


 export default router;
