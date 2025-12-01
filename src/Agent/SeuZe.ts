import { FastifyReply, FastifyRequest } from "fastify";
import { OpenAI } from "openai";
import { ChatCompletionMessage, ChatCompletionMessageToolCall, ChatCompletionTool } from "openai/resources/chat/completions";
import {Agenda} from "../Models/Agenda.js";
import { Responses } from "../Utils/Responses.js";
import { Tools } from "./Tools/Tools.js";

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
        },
        {
            type: "function",
            function:{
                name:"create_client",
                description: "Cria um cliente com base no número de telefone caso ele não exista, se o cliente já existir não acontece nada",
                parameters: {
                    type:"object",
                    properties:{
                        name: {type: "string",description:"Nome do cliente que esta entrando em contato com o barbeiro"}
                    }
                }
            }
        },
        {
            type:"function",
            function: {
                name: "find_barber",
                description: "Encontra o barbeiro que o cliente que agendar com base no id do barbeiro",
                parameters: {
                    type: "object",
                    properties: {
                        idBarber: {type: "number",description:"Id do barbeiro"}
                    }
                }
            }
        }
    ]

    constructor(){
        this.client = new OpenAI({
            apiKey: process.env.OPEN_AI_KEY
        });
    }

    secondRequest = async (msg: ChatCompletionMessage,call:ChatCompletionMessageToolCall,prompt: string,status: boolean, content: string) => {
        const Secondresponse = await this.client.chat.completions.create({
            model: "gpt-4.1",
            messages:[
                {role: "user",content: prompt},
                msg,
                {role:"tool",tool_call_id: call.id, content: JSON.stringify({success: status})},
                {
                    role:"system",
                    content
                }
            ]
        })

        return Secondresponse
    }

    getPrompt = async(req: FastifyRequest,reply: FastifyReply)=>{
        const body = req.body as {prompt: string, idClient?:number, idBarber?: number, telefone: string};
        const prompt: string = body.prompt;
        const idClient: number = body.idClient!;
        const idBarber: number = body.idBarber!;
        const telefone: string = body.telefone

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

                    FUNÇÕES:
                    - Quando você receber agendar_barber_1, significa que o cliente esta entrando em contato e o número no final é o id do barbeiro para você identificar qual o barbeiro que o cliente vai agendar.
                    - Você também pode criar clientes quando o cliente fornecer o nome dele, mas lembre-se, se o cliente não fornecer o nome dele não tem como você fazer um agendamento, pois você não terá acesso ao cliente.
                    - Também pode fazer agendamentos seguindo as regras de data mencionados a cima.
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

                    const Secondresponse = await this.secondRequest(msg,call,prompt,true,"Agendamento feito com sucesso via seu zé, retorne uma resposta simples, curta e carismática")

                    return reply.status(200).send(Responses.success(Secondresponse.choices[0].message.content as string));
                }catch(err){
                    console.error("Erro ao criar agenda via SeuZé:", err);
                    return reply.status(500).send(Responses.error("Ocorreu algum erro ao agendar via SeuZé")); 
                }
            }

            if(call.type === "function" && call.function.name === "delete_schedule"){
                try{
                    await agenda.delete(idClient,idBarber)
                    
                    const Secondresponse = await this.secondRequest(msg,call,prompt,true,"Desagendamento realizado com sucesso via SeuZé, informe isso ao usuário de forma breve e carismática")

                    return reply.status(200).send(Responses.success(Secondresponse.choices[0].message.content as string)) 
                }catch(err){
                    console.error("Erro ao desagendar via seu Zé")
                    return reply.status(500).send({message: "Erro ao desagendar via SeuZé"})
                }
            }

            if(call.type === "function" && call.function.name === "create_client"){
                const args = JSON.parse(call.function.arguments!)

                const status = await Tools.createClient({telefone, name: args.name})
                const Secondresponse = await this.secondRequest(msg,call,prompt,status,"O cliente esta entrando em contato, peça de forma curta, simples e carismática no que você pode ajudar no agendamento dele")

                return reply.status(200).send(Responses.success(Secondresponse.choices[0].message.content as string))
            }

            if(call.type === "function" && call.function.name === "find_barber"){
                const args = JSON.parse(call.function.arguments!)

                const res = await Tools.findBarber(args.idBarber)

                const Secondresponse = await this.secondRequest(msg,call,prompt,true,`O barbeiro foi identificado com o nome de ${res.nameBarber}, peça agora de forma carismática e curta o nome do cliente para fazer o agendamento`)

                return reply.status(200).send(Responses.success(Secondresponse.choices[0].message.content as string))
            }
        }
    }
    

}