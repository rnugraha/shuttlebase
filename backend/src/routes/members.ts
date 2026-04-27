import { FastifyInstance } from "fastify";
import {
  getMembers,
  getMember,
  createMember,
  deactivateMember,
  updateMember,
} from "../controllers/members";
import { authenticate } from "../middleware/authenticate";

export default async function memberRoutes(fastify: FastifyInstance) {
  fastify.get("/members", { preHandler: authenticate }, getMembers);
  fastify.get("/members/:id", { preHandler: authenticate }, getMember);
  fastify.post("/members", { preHandler: authenticate }, createMember);
  fastify.patch("/members/:id", { preHandler: authenticate }, updateMember);
  fastify.delete(
    "/members/:id",
    { preHandler: authenticate },
    deactivateMember,
  );
}
