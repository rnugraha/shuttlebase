import { FastifyRequest, FastifyReply } from "fastify";
import { Level, MemberStatus, PaymentStatus } from "../generated/prisma";
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

export const updateMember = async (
  req: FastifyRequest,
  reply: FastifyReply,
) => {
  const { id } = req.params as { id: string };

  const member = await prisma.member.findUnique({
    where: { id: Number(id) },
  });

  let updatedMember;

  if (!member) {
    return reply.status(404).send({ message: "Member not found" });
  } else {
    const body = req.body as {
      firstName?: string;
      lastName?: string;
      email?: string;
      phone?: string;
      pronoun?: string;
      dob?: string;
      address?: string;
      level?: Level;
      status?: MemberStatus;
      paymentStatus?: PaymentStatus;
      paidAt?: string;
    };

    updatedMember = await prisma.member.update({
      where: { id: Number(id) },
      data: {
        ...body,
        dob: body.dob ? new Date(body.dob) : undefined,
        paidAt: body.paidAt ? new Date(body.paidAt) : undefined,
      },
    });
  }

  return updatedMember;
};

export const deactivateMember = async (
  req: FastifyRequest,
  reply: FastifyReply,
) => {
  const { id } = req.params as { id: string };
  const member = await prisma.member.update({
    where: { id: Number(id) },
    data: { status: "INACTIVE" },
  });
  return member;
};
