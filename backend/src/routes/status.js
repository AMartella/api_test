export default async function status(fastify, options) {
    fastify.route({
        method: "GET",
        url: "/",
        handler: async (request, reply) => {
            return { status: "ok" }
        }
    })
}