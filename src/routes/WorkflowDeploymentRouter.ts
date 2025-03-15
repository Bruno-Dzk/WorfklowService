import express from "express";
import * as WorkflowDeploymentService from "../services/WorkflowDeploymentService.js";
import { workflowDeploymentSchema } from "../schemas/WorkflowDeploymentSchema.js";

const router = express.Router();

router.get("/", async (req, res, next) => {
  const deployment = workflowDeploymentSchema.safeParse(req.body);
  if (!deployment.success) {
    res.sendStatus(400);
  }
  try {
    await WorkflowDeploymentService.createDeployment(deployment.data);
  } catch (err) {
    console.error(err);
    return next(err);
  }
  res.sendStatus(200);
});

export default router;
