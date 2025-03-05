import express from 'express';
import * as LambdaService from '../services/LambdaService.js';;

const router = express.Router();

router.get('/', async (req, res, next) => {
    try {
        await LambdaService.createLambda('test-function');
    } catch (err) {
        console.error(err);
        return next(err);
    }
    res.sendStatus(200);
})

export default router;