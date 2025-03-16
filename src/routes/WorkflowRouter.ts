import { Router, Request, Response } from 'express';
import { createWorkflow } from '../controllers/WorkflowController.js';
import { transformWorkflow, NewWorkflowInput } from "../services/WorkflowTransformService.js";

 const router = Router();

 /**
  * PUT /workflow
  * This endpoint simply accepts the incoming JSON payload and logs it.
  */

 router.put('/', async(req: Request, res: Response) => {
    console.log("PUT /workflow called");
    try{
        const user_workflowDefinition = req.body;
        const aws_workflowDefinition = transformWorkflow(user_workflowDefinition)

        // VALIDATION MISSING, add later

        const awsWorkflow = transformWorkflow(aws_workflowDefinition);
        const result = await createWorkflow(awsWorkflow)

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

router.get('/', (req: Request, res: Response) => {
    res.send('GET endpoint is working but empty!');
  });

 export default router;
