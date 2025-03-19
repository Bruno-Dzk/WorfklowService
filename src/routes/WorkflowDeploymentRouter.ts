import express from "express";
import * as WorkflowDeploymentService from "../services/WorkflowDeploymentService.js";
import { workflowDeploymentRequestSchema } from "../schemas/WorkflowDeploymentRequestSchema.js";
import { NotFoundError } from "../services/WorkflowDeploymentService.js";
import { authorizeOrganization } from "../middlewares/AuthorizeOrganizationMiddleware.js";
import { authenticateJwt } from "../middlewares/AuthenticateJwt.js";

const router = express.Router();

router.post(
  "/organizations/:organization/deployments",
  authenticateJwt,
  authorizeOrganization,
  async (req, res, next) => {
    const deployment = workflowDeploymentRequestSchema.safeParse(req.body);
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
  },
);

router.get(
  "/organizations/:organization/deployments/:id",
  authenticateJwt,
  authorizeOrganization,
  async (req, res, next) => {
    try {
      const deploymentId = req.params.id;
      const result =
        await WorkflowDeploymentService.getDeployment(deploymentId);
      if (result === null) {
        res.sendStatus(404);
      }
      res.status(200).json(result);
    } catch (err) {
      console.error(err);
      return next(err);
    }
  },
);

router.delete(
  "/organizations/:organization/deployments/:id",
  authenticateJwt,
  authorizeOrganization,
  async (req, res, next) => {
    try {
      const deploymentId = req.params.id;
      await WorkflowDeploymentService.deleteDeployment(deploymentId);
      res.sendStatus(200);
    } catch (err) {
      if (err instanceof NotFoundError) {
        res.sendStatus(404);
      }
      console.error(err);
      return next(err);
    }
  },
);

export default router;
