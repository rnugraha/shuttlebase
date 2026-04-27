import Fastify from "fastify";
import memberRoutes from "./routes/members";
import jwt from "@fastify/jwt";
import authRoutes from "./routes/auth";

export function buildApp() {
  const fastify = Fastify({ logger: false });

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
