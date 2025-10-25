import fp from "fastify-plugin";

async function loggingHook(fastify, options) {
    const logPhase = (phase, req) => {
        fastify.log.info({
            phase,
            method: req.method,
            url: req.url,
            elapsed: req.startTime ? `${Date.now() - req.startTime}ms` : undefined,
        });
    };

    fastify.addHook("onRequest", async (req, reply) => {
        req.startTime = Date.now();
        logPhase("onRequest", req);
    });

    fastify.addHook("preParsing", async (req, reply) => logPhase("preParsing", req));
    fastify.addHook("preValidation", async (req, reply) => logPhase("preValidation", req));
    fastify.addHook("preHandler", async (req, reply) => logPhase("preHandler", req));

    fastify.addHook("onResponse", async (req, reply) => {
        const duration = Date.now() - req.startTime;
        fastify.log.info({
            phase: "onResponse",
            method: req.method,
            url: req.url,
            statusCode: reply.statusCode,
            duration: `${duration}ms`,
        });
    });
}

export default fp(loggingHook);