import { describe, it, expect, beforeAll, afterAll, afterEach } from "vitest";
import { buildApp } from "../app";
import { prisma } from "../lib/prisma";

const app = buildApp();

beforeAll(async () => {
	await app.ready();
});

afterAll(async () => {
	await app.close();
});

describe("GET /health", () => {
	it("returns ok", async () => {
		const res = await app.inject({ method: "GET", url: "/health" });
		expect(res.statusCode).toBe(200);
		expect(res.json()).toEqual({ status: "ok" });
	});
});

describe("GET /members", () => {
	it("returns an array", async () => {
		const res = await app.inject({ method: "GET", url: "/members" });
		expect(res.statusCode).toBe(200);
		expect(Array.isArray(res.json())).toBe(true);
	});
});

describe("GET /members/:id", () => {
	it("returns 404 for non-existent member", async () => {
		const res = await app.inject({ method: "GET", url: "/members/999999" });
		expect(res.statusCode).toBe(404);
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
			payload: {
				firstName: "Test",
				lastName: "User",
				email: `test.${Date.now()}@example.com`,
			},
		});
		expect(res.statusCode).toBe(201);
		const body = res.json();
		createdId = body.id;
		expect(body.firstName).toBe("Test");
		expect(body.lastName).toBe("User");
	});
});
