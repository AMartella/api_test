import Fastify from "fastify";
import App from "./app.js";

const fastify = Fastify({ logger: true });
const PORT = process.env.NODE_PORT || 8080;

fastify.register(App);

fastify.listen({ port: PORT, host: '0.0.0.0' }, (err) => {
    if (err) {
        fastify.log.error(err);
    }
});