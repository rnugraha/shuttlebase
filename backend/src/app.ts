import Fastify from "fastify";
import memberRoutes from "./routes/members";

export function buildApp() {
	const fastify = Fastify({ logger: false });

	fastify.get("/health", async () => {
		return { status: "ok" };
	});

	fastify.register(memberRoutes);

	return fastify;
}
