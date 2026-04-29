import { describe, it, expect, beforeAll, afterAll, afterEach } from "vitest";
import bcrypt from "bcrypt";
import { buildApp } from "../app";
import { prisma } from "../lib/prisma";

const app = buildApp();
let token: string;

beforeAll(async () => {
  await app.ready();

  await prisma.admin.upsert({
    where: { email: "test-admin@example.com" },
    update: {},
    create: {
      email: "test-admin@example.com",
      passwordHash: await bcrypt.hash("testpass", 10),
    },
  });

  const res = await app.inject({
    method: "POST",
    url: "/auth/login",
    payload: { email: "test-admin@example.com", password: "testpass" },
  });
  token = res.json().token;
});

afterAll(async () => {
  await prisma.admin.deleteMany({ where: { email: "test-admin@example.com" } });
  await app.close();
});

const auth = () => ({ Authorization: `Bearer ${token}` });

const memberFixture = {
  firstName: "Test",
  lastName: "User",
  phone: "0411000000",
  pronoun: "they/them",
  dob: new Date("1995-01-01"),
  address: "1 Test St, Sydney",
};

describe("GET /health", () => {
  it("returns ok", async () => {
    const res = await app.inject({ method: "GET", url: "/health" });
    expect(res.statusCode).toBe(200);
    expect(res.json()).toEqual({ status: "ok" });
  });
});

describe("GET /members", () => {
  it("returns an array", async () => {
    const res = await app.inject({
      method: "GET",
      url: "/members",
      headers: auth(),
    });
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.json())).toBe(true);
  });

  it("returns 401 without token", async () => {
    const res = await app.inject({ method: "GET", url: "/members" });
    expect(res.statusCode).toBe(401);
  });
});

describe("GET /members/:id", () => {
  it("returns 404 for non-existent member", async () => {
    const res = await app.inject({
      method: "GET",
      url: "/members/999999",
      headers: auth(),
    });
    expect(res.statusCode).toBe(404);
  });

  it("returns 401 without token", async () => {
    const res = await app.inject({ method: "GET", url: "/members/1" });
    expect(res.statusCode).toBe(401);
  });
});

describe("POST /members", () => {
  let createdId: number;

  afterEach(async () => {
    if (createdId) await prisma.member.delete({ where: { id: createdId } });
  });

  it("creates a member and returns 201", async () => {
    const res = await app.inject({
      method: "POST",
      url: "/members",
      headers: auth(),
      payload: { ...memberFixture, email: `test.${Date.now()}@example.com` },
    });
    expect(res.statusCode).toBe(201);
    const body = res.json();
    createdId = body.id;
    expect(body.firstName).toBe("Test");
    expect(body.lastName).toBe("User");
  });

  it("returns 409 for duplicate email", async () => {
    const email = `dupe.${Date.now()}@example.com`;
    const first = await app.inject({
      method: "POST",
      url: "/members",
      headers: auth(),
      payload: { ...memberFixture, email },
    });
    createdId = first.json().id;

    const second = await app.inject({
      method: "POST",
      url: "/members",
      headers: auth(),
      payload: { ...memberFixture, email },
    });
    expect(second.statusCode).toBe(409);
  });
});

describe("POST /members with failures", () => {
  it("returns 401 without token", async () => {
    const res = await app.inject({
      method: "POST",
      url: "/members",
      payload: {
        firstName: "Test",
        lastName: "User",
        email: "unauth@example.com",
      },
    });
    expect(res.statusCode).toBe(401);
  });

  it("returns 400 when required fields are missing", async () => {
    const res = await app.inject({
      method: "POST",
      url: "/members",
      headers: auth(),
      payload: { firstName: "Test" },
    });
    expect(res.statusCode).toBe(400);
    expect(res.json().errors).toBeDefined();
  });

  it("returns 400 for invalid email format", async () => {
    const res = await app.inject({
      method: "POST",
      url: "/members",
      headers: auth(),
      payload: { ...memberFixture, email: "not-an-email" },
    });
    expect(res.statusCode).toBe(400);
    expect(res.json().errors.email).toBeDefined();
  });
});

describe("PATCH /members/:id", () => {
  let memberId: number;

  beforeAll(async () => {
    const member = await prisma.member.create({
      data: { ...memberFixture, email: `patch.${Date.now()}@example.com` },
    });
    memberId = member.id;
  });

  afterAll(async () => {
    await prisma.member.delete({ where: { id: memberId } });
  });

  it("updates allowed fields", async () => {
    const res = await app.inject({
      method: "PATCH",
      url: `/members/${memberId}`,
      headers: auth(),
      payload: { firstName: "Updated", level: "ADVANCED" },
    });
    expect(res.statusCode).toBe(200);
    const body = res.json();
    expect(body.firstName).toBe("Updated");
    expect(body.level).toBe("ADVANCED");
  });

  it("returns 400 for invalid email format", async () => {
    const res = await app.inject({
      method: "PATCH",
      url: `/members/${memberId}`,
      headers: auth(),
      payload: { email: "not-an-email" },
    });
    expect(res.statusCode).toBe(400);
    expect(res.json().errors.email).toBeDefined();
  });

  it("returns 400 for invalid level enum", async () => {
    const res = await app.inject({
      method: "PATCH",
      url: `/members/${memberId}`,
      headers: auth(),
      payload: { level: "EXPERT" },
    });
    expect(res.statusCode).toBe(400);
    expect(res.json().errors.level).toBeDefined();
  });

  it("returns 404 for non-existent member", async () => {
    const res = await app.inject({
      method: "PATCH",
      url: "/members/999999",
      headers: auth(),
      payload: { firstName: "X" },
    });
    expect(res.statusCode).toBe(404);
  });

  it("returns 401 without token", async () => {
    const res = await app.inject({
      method: "PATCH",
      url: `/members/${memberId}`,
      payload: { firstName: "X" },
    });
    expect(res.statusCode).toBe(401);
  });
});

describe("DELETE /members/:id", () => {
  let memberId: number;

  beforeAll(async () => {
    const member = await prisma.member.create({
      data: { ...memberFixture, email: `delete.${Date.now()}@example.com` },
    });
    memberId = member.id;
  });

  afterAll(async () => {
    await prisma.member.delete({ where: { id: memberId } });
  });

  it("sets status to INACTIVE", async () => {
    const res = await app.inject({
      method: "DELETE",
      url: `/members/${memberId}`,
      headers: auth(),
    });
    expect(res.statusCode).toBe(200);
    expect(res.json().status).toBe("INACTIVE");
  });

  it("returns 404 for non-existent member", async () => {
    const res = await app.inject({
      method: "DELETE",
      url: "/members/999999",
      headers: auth(),
    });
    expect(res.statusCode).toBe(404);
  });

  it("returns 401 without token", async () => {
    const res = await app.inject({
      method: "DELETE",
      url: `/members/${memberId}`,
    });
    expect(res.statusCode).toBe(401);
  });
});
