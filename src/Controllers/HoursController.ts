import { ControllerInterface } from "../Utils/interfaces/ControllerInterface.js";
import { Hours as HoursType } from "../Utils/Types.js";
import { Hours } from "../Models/Hours.js";
import { FastifyRequest, FastifyReply } from "fastify";
import { Responses } from "../Utils/Responses.js";

export class HoursController implements ControllerInterface<HoursType>{
    model = new Hours()

    create = async(req: FastifyRequest, reply: FastifyReply): Promise<void> =>{
        const body = req.body as HoursType

        try{
            await this.model.create(body)
            return reply.status(201).send(Responses.success("Horário cadastrado com sucesso"))
        }catch(err){
            console.error("Ocorreu um erro ao cadastrar horário disponível ",err)
            return reply.status(500).send(Responses.error("Infelizemente ocorreu um erro ao cadastrar horário"))
        }
    }
}