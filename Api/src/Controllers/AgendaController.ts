import { ControllerInterface } from "../Utils/interfaces/ControllerInterface.js";
import { Agenda as AgendaType, AgendaWithClientInfo as AgendaInfo } from "../Utils/Types.js";
import { Agenda } from "../Models/Agenda.js";
import { FastifyReply, FastifyRequest } from "fastify";
import { Responses } from "../Utils/Responses.js";

export class AgendaController implements ControllerInterface<AgendaType> {
    model: Agenda = new Agenda()

    create = async (req: FastifyRequest, reply: FastifyReply): Promise<void> => {
        try{
            const res = await this.model.create(req.body as AgendaType);

            if(res)
                return reply.status(201).send(Responses.success("Agendamento realizado com sucesso"));
            
            return reply.status(400).send(Responses.error("Infelizmente esse horário está indisponivel"))
        }catch(err){
            console.error("Erro ao criar agenda:", err);
            reply.status(500).send(Responses.error("Infelizmente ocorreu um erro no agendamento"));
            throw err;
        }
    }
    
    findAll = async (req: FastifyRequest, reply: FastifyReply): Promise<AgendaInfo[] | any> => {
        const idBarber: number = req.idBarber

        if(!idBarber){
            return reply.status(400).send(Responses.error("O ID do barbeiro é obrigatório"));
        }

        try{
            const agendas = await this.model.findAll<AgendaInfo>(idBarber);

            if(!agendas || agendas.length === 0)
                return reply.status(404).send(Responses.error("Nenhum agendamento encontrado"));

            return reply.status(200).send(Responses.success("Agendamentos retornados com sucesso",agendas));
        }catch(err){
            console.error("Erro ao buscar agendas:", err);
            reply.status(500).send(Responses.error("Infelizmente ocorreu algum erro ao buscar os agendamentos"));
            throw err;
        }
    }
    
    delete = async(req: FastifyRequest,reply: FastifyReply): Promise<void> =>{
        try{
            const idBarber: number = req.idBarber
            const idClient: number = (req.params as {idClient: number}).idClient
            
            await this.model.delete(idClient, idBarber);
            return reply.status(200).send(Responses.success("Agendamento desmarcado com sucesso"))
        }catch(err){
            console.error("Erro ao deletar agenda ", err)
            return reply.status(500).send(Responses.error("Infelizmente ocorreu um erro ao desagendar"))
        }
    }
}