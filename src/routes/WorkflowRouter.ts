import { Router, Request, Response } from 'express';
import { createWorkflow } from '../controllers/WorkflowController.js';

 const router = Router();

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

router.get('/', (req: Request, res: Response) => {
    res.send('GET endpoint is working but empty!');
  });

 export default router;
