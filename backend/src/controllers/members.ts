import { FastifyRequest, FastifyReply } from "fastify";
import { prisma } from "../lib/prisma";

export const getMembers = async (req: FastifyRequest, reply: FastifyReply) => {
  const members = await prisma.member.findMany({
    orderBy: { joinedAt: "desc" },
  });
  return members;
};

export const createMember = async (
  req: FastifyRequest,
  reply: FastifyReply,
) => {
  const body = req.body as {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    pronoun?: string;
    dob?: string;
    address?: string;
  };

  const member = await prisma.member.create({
    data: {
      firstName: body.firstName,
      lastName: body.lastName,
      email: body.email,
      phone: body.phone,
      pronoun: body.pronoun,
      dob: body.dob ? new Date(body.dob) : undefined,
      address: body.address,
    },
  });

  reply.status(201).send(member);
};

export const getMember = async (req: FastifyRequest, reply: FastifyReply) => {
  const { id } = req.params as { id: string };
  const member = await prisma.member.findUnique({
    where: { id: Number(id) },
  });

  if (!member) {
    return reply.status(404).send({ message: "Member not found" });
  }

  return member;
};
