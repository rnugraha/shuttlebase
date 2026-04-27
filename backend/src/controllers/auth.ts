import { FastifyRequest, FastifyReply } from "fastify";
import { prisma } from "../lib/prisma";
import bcrypt from "bcrypt";

export const login = async (req: FastifyRequest, reply: FastifyReply) => {
  const { email, password } = req.body as {
    email: string;
    password: string;
  };

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
};
