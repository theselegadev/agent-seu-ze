import { FastifyRequest, FastifyReply } from "fastify";
import { Client } from "../Models/Client.js";
import { ControllerInterface } from "../Utils/interfaces/ControllerInterface";
import { Client as ClientType } from "../Utils/Types.js";
import { Responses } from "../Utils/Responses.js";

export class ClientController implements ControllerInterface<ClientType> {
    model: Client = new Client()

    create = async(req: FastifyRequest, reply: FastifyReply): Promise<void> =>{
        const data: ClientType = {...req.body as ClientType, idBarber: req.idBarber};

        try{
            await this.model.create(data)
            return reply.status(201).send(Responses.success("Cliente registrado com sucesso"));
        }catch(err){
            console.error("Erro ao criar cliente:", err);
            return reply.status(500).send(Responses.error("Infelizmente ocorreu um erro ao registrar o cliente"));
        }
    }

    getAllbyBarber = async(req: FastifyRequest, reply: FastifyReply): Promise<void> =>{
        const idBarber: number = req.idBarber;

        try{
            const clients =  await this.model.getAllByBarber(idBarber)
            
            if(clients.length === 0)
                return reply.status(404).send(Responses.error("Nenhum cliente encontrado"));

            return reply.status(200).send(Responses.success("Clientes encontrados com sucesso", clients));
        }catch(err){
            console.error("Erro ao listar clientes:", err);
            return reply.status(500).send(Responses.error("Infelizmente ocorreu um erro ao listar os clientes"));
        }
    }

    update = async(req: FastifyRequest, reply: FastifyReply): Promise<void> =>{
        
    }
}