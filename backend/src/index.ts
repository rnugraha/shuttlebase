import Fastify from "fastify";
import memberRoutes from "./routes/members";

const fastify = Fastify({ logger: true });

fastify.get("/health", async () => {
	return { status: "ok" };
});

fastify.register(memberRoutes);

const start = async () => {
	try {
		await fastify.listen({ port: 3000 });
	} catch (err) {
		fastify.log.error(err);
		process.exit(1);
	}
};

start();
