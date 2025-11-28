import { FastifyReply, FastifyRequest } from "fastify";
import { OpenAI } from "openai";
import { ChatCompletionTool } from "openai/resources/chat/completions";
import {Agenda} from "../Models/Agenda.js";

export class SeuZe{
    private client
    private tools: ChatCompletionTool[] = [
        {
            type: "function",
            function:{
                name: "create_agenda",
                description: "Cria um agendamento para o cliente com o barbeiro no dia e hora especificados.",
                parameters: {
                    type: "object",
                    properties: {
                        date_time: {type:"string", description: "Data e hora do agendamento no formato AAAA-MM-DD HH:MM"},      
                    },
                    required: ["date_time"]
                }
            }
        },
        {
            type: "function",
            function: {
                name: "delete_schedule",
                description: "Deleta o agendamento se ele já tiver um agendamento realizado"
            }
        }
    ]

    constructor(){
        this.client = new OpenAI({
            apiKey: process.env.OPEN_AI_KEY
        });
    }

    getPrompt = async(req: FastifyRequest,reply: FastifyReply)=>{
        const body = req.body as {prompt: string, idClient?:number, idBarber?: number};
        const prompt: string = body.prompt;
        const idClient: number = body.idClient!;
        const idBarber: number = body.idBarber!;

        const response = await this.client.chat.completions.create({
            model: "gpt-4.1",
            messages:[
                {role: "system", content: `
                    Você é o SeuZé, um assistente virtual especializado em agendamentos para barbearias. 
                    Seu objetivo é ajudar os clientes a marcar horários com rapidez, precisão e sem erros.

                    A data atual é ${new Date().toLocaleDateString("pt-BR").split("/").reverse().join("-")}.

                    REGRAS PARA INTERPRETAR DATAS RELATIVAS
                    - "hoje" = exatamente a data atual.
                    - "amanhã" = data atual + 1 dia (NUNCA +2).
                    - "depois de amanhã" = data atual + 2 dias.
                    - "próxima <dia da semana>" = a próxima ocorrência real desse dia, sem adicionar dias extras.

                    RESTRIÇÕES OBRIGATÓRIAS
                    - Nunca pule dias além do necessário.
                    - Nunca ajuste a data automaticamente.
                    - Nunca altere o ano sem motivo.
                    - Nunca gere datas passadas.
                    - Nunca gere horários anteriores ao horário atual quando a escolha for “hoje”.
                    - A interpretação deve ser EXATA, sem adivinhações ou correções criativas.

                    FORMATO DA DATA
                    Sempre produza datas no formato: "YYYY-MM-DD HH:mm".
                `},
                {role: "user", content: prompt}
            ],
            tools: this.tools,
            tool_choice: "auto"
        });

        const msg = response.choices[0].message;

        const agenda = new Agenda();

        if(msg.tool_calls){
            const call = msg.tool_calls[0];

            if(call.type === "function" && call.function.name === "create_agenda"){
                const args = JSON.parse(call.function.arguments!);

                try{
                    await agenda.create({client_id: idClient, datetime: args.date_time, barber_id: idBarber});
                    return reply.status(200).send({message: "Agenda criada com sucesso via SeuZé"});
                }catch(err){
                    console.error("Erro ao criar agenda via SeuZé:", err);
                    return reply.status(500).send({message: "Erro ao criar agenda via SeuZé"}); 
                }
            }

            if(call.type === "function" && call.function.name === "delete_schedule"){
                try{
                    await agenda.delete(idClient,idBarber)
                    return reply.status(200).send({message: "Agendamento cancelado via SeuZé"}) 
                }catch(err){
                    console.error("Erro ao desagendar via seu Zé")
                    return reply.status(500).send({message: "Erro ao desagendar via SeuZé"})
                }
            }
        }
    }
    

}