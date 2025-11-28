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
            return reply.status(201).send(Responses.success("Conta criada com sucesso"));
        }catch(err){
            console.error("Erro ao criar cliente:", err);
            return reply.status(500).send(Responses.error("Infelizmente ocorreu um erro ao criar sua conta"));
        }
    }

    login = async(req: FastifyRequest, reply: FastifyReply): Promise<boolean> =>{
        const body = req.body as {email:string,password:string}
        const res = await this.model.login(body.email,body.password);

        if(!res)
           return reply.status(401).send(Responses.error("Email ou senha incorretos"))
        return reply.status(200).send(Responses.success("Login realizado com sucesso"))
    }

    update = async(req: FastifyRequest, reply: FastifyReply): Promise<void> =>{
        
    }
}