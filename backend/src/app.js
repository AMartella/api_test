import AutoLoad from "@fastify/autoload";
import { join } from 'node:path';
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = join(__filename, "..");

export default async function app(fastify, options) {
    fastify.register(AutoLoad, {
        dir: join(__dirname, "decorators"),
        options
    });

    fastify.register(AutoLoad, {
        dir: join(__dirname, "hooks"),
        options
    });

    fastify.register(AutoLoad, {
        dir: join(__dirname, "plugins"),
        options
    });

    fastify.register(AutoLoad, {
        dir: join(__dirname, "routes"),
        options
    });
}