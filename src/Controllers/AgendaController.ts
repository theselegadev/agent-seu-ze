import { ControllerInterface } from "../Utils/interfaces/ControllerInterface.js";
import { Agenda as AgendaType } from "../Utils/Types.js";
import { Agenda } from "../Models/Agenda.js";
import { FastifyReply, FastifyRequest } from "fastify";

export class AgendaController implements ControllerInterface<AgendaType> {
    model = new Agenda()

    create = async (req: FastifyRequest, reply: FastifyReply): Promise<void> => {
        try{
            await this.model.create(req.body as AgendaType);
            return reply.status(201).send({message: "Agenda criada com sucesso"});
        }catch(err){
            console.error("Erro ao criar agenda:", err);
            reply.status(500).send({message: "Erro ao criar agenda"});
            throw err;
        }
    }   
}