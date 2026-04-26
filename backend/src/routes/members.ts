import { FastifyInstance } from "fastify";
import { getMembers, getMember, createMember } from "../controllers/members";

export default async function memberRoutes(fastify: FastifyInstance) {
	fastify.get("/members", getMembers);
	fastify.get("/members/:id", getMember);
	fastify.post("/members", createMember);
}
