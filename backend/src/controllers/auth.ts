import { FastifyRequest, FastifyReply } from "fastify";
import { prisma } from "../lib/prisma";
import bcrypt from "bcrypt";
import { loginSchema } from "../schemas/auth";

export const login = async (req: FastifyRequest, reply: FastifyReply) => {
  try {
    const result = loginSchema.safeParse(req.body);
    if (!result.success) {
      return reply.status(400).send({
        message: "Validation failed",
        errors: result.error.flatten,
      });
    }
    const { email, password } = result.data;

    const admin = await prisma.admin.findUnique({
      where: { email },
    });

    if (!admin) {
      return reply.status(404).send({ message: "Invalid credentials" });
    }

    const validPassword = await bcrypt.compare(password, admin.passwordHash);

    if (!validPassword) {
      return reply.status(404).send({ message: "Invalid credentials" });
    }

    const token = await reply.jwtSign({ id: admin.id, email: admin.email });

    return { token };
  } catch (error) {
    reply.status(500).send({ message: "Login failed" });
  }
};
