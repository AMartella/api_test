const fastify = require('fastify')({ logger: true });

require('dotenv').config();

const PORT = process.env.NODE_PORT || 8080;

fastify.get('/', async (request, reply) => {
    return { message: 'Backend Fastify running!' };
});

const start = async () => {
    try {
        await fastify.listen({ port: PORT, host: '0.0.0.0' });
        console.log(`Server listening on port ${PORT}`);
    } catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
};

start();
