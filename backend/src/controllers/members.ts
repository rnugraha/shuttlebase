import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { createMemberSchema, updateMemberSchema } from "../schemas/member";

const getMembersQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  search: z.string().optional(),
  status: z.enum(["ACTIVE", "INACTIVE", "PENDING", "WAITLIST", "TRYOUT"]).optional(),
  level: z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED"]).optional(),
  paymentStatus: z.enum(["PAID", "UNPAID", "OVERDUE", "EXEMPT"]).optional(),
});

export const getMembers = async (req: FastifyRequest, reply: FastifyReply) => {
  const result = getMembersQuerySchema.safeParse(req.query);

  if (!result.success) {
    return reply.status(400).send({
      message: "Invalid query parameters",
      errors: z.flattenError(result.error).fieldErrors,
    });
  }

  const { page, limit, search, status, level, paymentStatus } = result.data;
  const skip = (page - 1) * limit;

  const where = {
    ...(search && {
      OR: [
        { firstName: { contains: search, mode: "insensitive" as const } },
        { lastName: { contains: search, mode: "insensitive" as const } },
        { email: { contains: search, mode: "insensitive" as const } },
      ],
    }),
    ...(status && { status }),
    ...(level && { level }),
    ...(paymentStatus && { paymentStatus }),
  };

  const [members, total] = await Promise.all([
    prisma.member.findMany({ skip, take: limit, where, orderBy: { joinedAt: "desc" } }),
    prisma.member.count({ where }),
  ]);

  return {
    data: members,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
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
    const dateOfBirth = new Date(dob);

    const member = await prisma.member.create({
      data: {
        ...rest,
        dob: dateOfBirth ?? undefined,
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
