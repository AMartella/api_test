import mongoose from "mongoose";
import fp from "fastify-plugin";

async function mongo(fastify, options) {
    const MONGO_URI = options.uri || process.env.MONGO_URI;
    const MONGO_DB = options.db || process.env.MONGO_DB;

    if (!MONGO_URI) throw new Error("MONGO_URI is not defined");
    if (!MONGO_DB) throw new Error("MONGO_DB is not defined");

    try {
        await mongoose.connect(MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        mongoose.connection.on("error", (err) => fastify.log.error(err));
        mongoose.connection.on("disconnected", () => fastify.log.warn("MongoDB disconnected"));

        fastify.decorate("mongo", mongoose.connection.db.collection(MONGO_DB));

        fastify.addHook("onClose", async () => {
            await mongoose.connection.close();
            fastify.log.info("MongoDB connection closed");
        });

        fastify.log.info("MongoDB connected");
    } catch (err) {
        fastify.log.error("Failed to connect to MongoDB", err);
        throw err;
    }
}

export default fp(mongo);
