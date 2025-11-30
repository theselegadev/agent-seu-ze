import { FastifyRequest, FastifyReply } from "fastify";
import { Client } from "../Models/Client.js";
import { ControllerInterface } from "../Utils/interfaces/ControllerInterface";
import { Client as ClientType } from "../Utils/Types.js";
import { Responses } from "../Utils/Responses.js";

export class ClientController implements ControllerInterface<ClientType> {
    model: Client = new Client()

    create = async(req: FastifyRequest, reply: FastifyReply): Promise<void> =>{
        try{
            await this.model.create(req.body as ClientType)
            return reply.status(201).send(Responses.success("Cliente registrado com sucesso"));
        }catch(err){
            console.error("Erro ao criar cliente:", err);
            return reply.status(500).send(Responses.error("Infelizmente ocorreu um erro ao registrar o cliente"));
        }
    }

    update = async(req: FastifyRequest, reply: FastifyReply): Promise<void> =>{
        
    }
}