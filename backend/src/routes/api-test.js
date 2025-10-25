export default async function apiTest(fastify, options) {
    fastify.route({
        method: "POST",
        url: "/v1/api-test",
        handler: async (request, reply) => {
            try {
                const { url, method = "GET", headers = {}, body } = request.body || {};

                if (!url) {
                    return reply.status(400).send({ error: "URL is required" });
                }

                const startTime = Date.now();
                let responseData = { status: 0, headers: {}, body: null };
                try {
                    const fetchResponse = await fetch(url, {
                        method,
                        headers,
                        body: body ? JSON.stringify(body) : undefined,
                    });

                    const contentType = fetchResponse.headers.get("content-type") || "";
                    let responseBody;

                    if (contentType.includes("application/json")) {
                        responseBody = await fetchResponse.json();
                    } else {
                        responseBody = await fetchResponse.text();
                    }

                    responseData = {
                        status: fetchResponse.status,
                        headers: Object.fromEntries(fetchResponse.headers.entries()),
                        body: responseBody,
                    };
                } catch (err) {
                    responseData.body = err.message;
                }

                const duration = Date.now() - startTime;

                const testData = {
                    request: { url, method, headers, body },
                    response: { ...responseData, durationMs: duration },
                    timestamp: new Date(),
                };

                const result = await fastify.mongo.insertOne(testData);
                await fastify.redis.set("last_test", JSON.stringify(testData), "EX", 60 * 60 * 24);

                return {
                    message: "Test executed and saved successfully",
                    mongoId: result.insertedId,
                    testData,
                };
            } catch (err) {
                fastify.log.error(err);
                reply.status.code(500).send({ error: err.message });
            }
        }
    });

    fastify.get("/test/last", async (request, reply) => {
        try {
            const last = await fastify.redis.get("last_test");
            if (!last) return { message: "No cached test found" };
            return { lastTest: JSON.parse(last) };
        } catch (err) {
            fastify.log.error("Error in /api/test/last:", err);
            reply.status(500).send({ error: "Internal Server Error" });
        }
    });
}