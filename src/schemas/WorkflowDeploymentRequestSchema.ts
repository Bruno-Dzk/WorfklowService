import { z } from "zod";

export const workflowDeploymentRequestSchema = z.object({
  modules: z.string().array(),
});

export type WorkflowDeploymentRequest = z.infer<
  typeof workflowDeploymentRequestSchema
>;
