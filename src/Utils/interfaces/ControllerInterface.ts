import { ModelsInterface } from "./ModelsInterface.js";
import { FastifyRequest, FastifyReply } from "fastify";

export interface ControllerInterface<T> {
    model: ModelsInterface<T>;

    create(req: FastifyRequest,reply: FastifyReply): Promise<void>;
    update(req: FastifyRequest,reply: FastifyReply): Promise<void>;
    login(req: FastifyRequest,reply: FastifyReply): Promise<boolean>;
}