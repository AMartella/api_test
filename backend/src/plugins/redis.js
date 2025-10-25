import Redis from "ioredis";
import fp from "fastify-plugin";

async function redisPlugin(fastify, options) {
    const redisUrl = options.url || process.env.REDIS_URL;
    if (!redisUrl) throw new Error("REDIS_URL is not defined");

    const redis = new Redis(redisUrl, options.redisOptions);

    redis.on("connect", () => fastify.log.info("Connected to Redis"));
    redis.on("ready", () => fastify.log.info("Redis ready"));
    redis.on("error", (err) => fastify.log.error("Redis error:", err));
    redis.on("close", () => fastify.log.warn("Redis connection closed"));

    fastify.decorate("redis", redis);

    fastify.addHook("onClose", async () => {
        try {
            await redis.quit();
            fastify.log.info("Redis connection gracefully closed");
        } catch (err) {
            fastify.log.error("Error closing Redis connection:", err);
        }
    });
}

export default fp(redisPlugin);
