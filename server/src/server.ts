import { fastifyCors } from "@fastify/cors";
import { fastify } from "fastify";
import {
    serializerCompiler,
    validatorCompiler,
    type ZodTypeProvider,
} from "fastify-type-provider-zod";
// import { get } from "http";
import { env } from "./env.ts";
import { getRoomsRoute } from "./http/routes/get-rooms.ts";
import { createRoomRoute } from "./http/routes/create-room.ts";

// import { sql } from './db/connection.ts';

const app = fastify().withTypeProvider<ZodTypeProvider>();

app.register(fastifyCors, {
    origin: "http://localhost:5173",
});

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.get("/health", async () => {
    return { message: "Funciona, carai" };
});

app.register(getRoomsRoute);
app.register(createRoomRoute)

app
    .listen({
        port: env.PORT,
        host: "0.0.0.0",
    })
    .then(() => {
        console.log(
            `HTTP server rodando na http://localhost:${env.PORT}, pressione Ctrl+C para parar.`,
        );
    });
