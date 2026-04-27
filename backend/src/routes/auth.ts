import { FastifyInstance } from "fastify";
import { login } from "../controllers/auth";

export default async function authRoutes(fastify: FastifyInstance) {
  fastify.post("/auth/login", login);
}
