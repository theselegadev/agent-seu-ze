import { ControllerInterface } from "../Utils/interfaces/ControllerInterface.js";
import { Agenda as AgendaType, AgendaWithClientInfo as AgendaInfo } from "../Utils/Types.js";
import { Agenda } from "../Models/Agenda.js";
import { FastifyReply, FastifyRequest } from "fastify";

export class AgendaController implements ControllerInterface<AgendaType> {
    model: Agenda = new Agenda()

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
    
    findAll = async (req: FastifyRequest, reply: FastifyReply): Promise<AgendaInfo[] | any> => {
        const params = req.params as {idBarber: number};
        const idBarber: number = params.idBarber;

        if(!idBarber){
            return reply.status(400).send({message: "ID do barbeiro é obrigatório"});
        }

        try{
            const agendas = await this.model.findAll<AgendaInfo>(idBarber);

            if(!agendas || agendas.length === 0)
                return reply.status(404).send({message: "Nenhuma agenda encontrada para este barbeiro"});

            return reply.status(200).send(agendas);
        }catch(err){
            console.error("Erro ao buscar agendas:", err);
            reply.status(500).send({message: "Erro ao buscar agendas"});
            throw err;
        }
    }   
}