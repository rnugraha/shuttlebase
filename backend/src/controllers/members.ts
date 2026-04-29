import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";
import { Level, MemberStatus, PaymentStatus } from "../generated/prisma";
import { prisma } from "../lib/prisma";
import { createMemberSchema, updateMemberSchema } from "../schemas/member";

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
  try {
    const result = createMemberSchema.safeParse(req.body);

    if (!result.success) {
      return reply.status(400).send({
        message: "Validation failed",
        errors: z.flattenError(result.error).fieldErrors,
      });
    }

    const { dob, ...rest } = result.data;

    const member = await prisma.member.create({
      data: {
        ...rest,
        dob: dob ? new Date(dob) : undefined,
      },
    });
    reply.status(201).send(member);
  } catch (error: any) {
    if (error.code === "P2002") {
      return reply.status(409).send({ message: "Email already exists" });
    }
    reply.status(500).send({ message: "Failed to create member" });
  }
};

export const getMember = async (req: FastifyRequest, reply: FastifyReply) => {
  try {
    const { id } = req.params as { id: string };
    const member = await prisma.member.findUnique({
      where: { id: Number(id) },
    });

    if (!member) {
      return reply.status(404).send({ message: "Member not found" });
    }

    return member;
  } catch (error) {
    reply.status(500).send({ message: "Failed to fetch member" });
  }
};

export const updateMember = async (
  req: FastifyRequest,
  reply: FastifyReply,
) => {
  try {
    const { id } = req.params as { id: string };

    const member = await prisma.member.findUnique({
      where: { id: Number(id) },
    });

    let updatedMember;

    if (!member) {
      return reply.status(404).send({ message: "Member not found" });
    } else {
      const result = updateMemberSchema.safeParse(req.body);

      if (!result.success) {
        return reply.status(400).send({
          message: "Validation failed",
          errors: z.flattenError(result.error).fieldErrors,
        });
      }

      const { dob, paidAt, ...rest } = result.data;
      updatedMember = await prisma.member.update({
        where: { id: Number(id) },
        data: {
          ...rest,
          dob: dob ? new Date(dob) : undefined,
          paidAt: paidAt ? new Date(paidAt) : undefined,
        },
      });
    }

    return updatedMember;
  } catch (error: any) {
    if (error.code === "P2025") {
      return reply.status(404).send({ message: "Member not found" });
    }
    reply.status(500).send({ message: "Failed to update member" });
  }
};

export const deactivateMember = async (
  req: FastifyRequest,
  reply: FastifyReply,
) => {
  try {
    const { id } = req.params as { id: string };
    const member = await prisma.member.update({
      where: { id: Number(id) },
      data: { status: "INACTIVE" },
    });
    return member;
  } catch (error: any) {
    if (error.code === "P2025") {
      return reply.status(404).send({ message: "Member not found" });
    }
    reply.status(500).send({ message: "Failed to deactivate member" });
  }
};
