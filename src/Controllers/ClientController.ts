import { FastifyRequest, FastifyReply } from "fastify";
import { Client } from "../Models/Client.js";
import { ControllerInterface } from "../Utils/interfaces/ControllerInterface";
import { Client as ClientType } from "../Utils/Types.js";

export class ClientController implements ControllerInterface<ClientType> {
    model: Client = new Client()

    create = async(req: FastifyRequest, reply: FastifyReply): Promise<void> =>{
        try{
            await this.model.create(req.body as ClientType)
            return reply.status(201).send({message: "Cliente criado com sucesso"});
        }catch(err){
            console.error("Erro ao criar cliente:", err);
            return reply.status(500).send({message: "Erro ao criar cliente"});
        }
    }
    update = async(req: FastifyRequest, reply: FastifyReply): Promise<void> =>{
        
    }
}