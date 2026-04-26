import { FastifyInstance } from "fastify";
import { getMembers, createMember } from "../controllers/members";

export default async function memberRoutes(fastify: FastifyInstance) {
  fastify.get("/members", getMembers);
  fastify.post("/members", createMember);
}
