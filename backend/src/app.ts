import Fastify from "fastify";
import cors from "@fastify/cors";
import jwt from "@fastify/jwt";
import authRoutes from "./routes/auth";
import memberRoutes from "./routes/members";

export function buildApp() {
  const fastify = Fastify({ logger: false });

  fastify.register(cors, {
    origin: process.env.FRONTEND_URL ?? "http://localhost:5173",
  });

  fastify.register(jwt, {
    secret: process.env.JWT_SECRET as string,
    sign: {
      expiresIn: "7d",
    },
  });

  fastify.get("/health", async () => {
    return { status: "ok" };
  });

  fastify.register(authRoutes);
  fastify.register(memberRoutes);

  return fastify;
}
