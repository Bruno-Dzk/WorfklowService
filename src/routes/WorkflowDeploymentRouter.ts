import express from "express";
import * as WorkflowDeploymentService from "../services/WorkflowDeploymentService.js";
import { workflowDeploymentSchema } from "../schemas/WorkflowDeploymentSchema.js";

const router = express.Router();

router.put("/", async (req, res, next) => {
  const deployment = workflowDeploymentSchema.safeParse(req.body);
  if (!deployment.success) {
    res.sendStatus(400);
  }
  try {
    const deploymentInfo = await WorkflowDeploymentService.createDeployment(
      deployment.data,
    );
    res.status(200).json(deploymentInfo);
  } catch (err) {
    console.error(err);
    return next(err);
  }
});

export default router;
