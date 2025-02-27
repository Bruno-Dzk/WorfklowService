import express from 'express';
import * as LambdaService from "../services/LambdaService.js";

const router = express.Router();

router.get('/', (req, res) => {
    LambdaService.createLambda("hello")
    res.sendStatus(200);
})

export default router;