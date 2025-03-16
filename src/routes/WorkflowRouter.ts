import { Router, Request, Response } from 'express';

 const router = Router();

 /**
  * PUT /workflow
  * This endpoint simply accepts the incoming JSON payload and logs it.
  */

 router.put('/', (req: Request, res: Response) => {
    console.log("PUT /workflow called");
    console.log("Raw request body:", req.body);
    res.status(200).json({
      message: 'Input accepted!'
    });
  });

router.get('/', (req: Request, res: Response) => {
    res.send('GET endpoint is working but empty!');
  });

 export default router;
