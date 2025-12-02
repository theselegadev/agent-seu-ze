import { FastifyReply, FastifyRequest } from "fastify";
import { OpenAI } from "openai";
import { ChatCompletionMessage, ChatCompletionMessageToolCall, ChatCompletionTool } from "openai/resources/chat/completions";
import { Client as ClientType } from "../Utils/Types.js";
import { Client } from "../Models/Client.js";
import { Responses } from "../Utils/Responses.js";
import { Tools } from "./Tools/Tools.js";
import { SessionManager } from "../Utils/Session.js";

const sessionManager = new SessionManager()
const client = new Client()

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
                description: "Cria um cliente com base no número de telefone caso ele não exista",
                parameters: {
                    type:"object",
                    properties:{
                        name: {type: "string",description:"Nome do cliente que esta entrando em contato com o barbeiro"},
                        idBarber: {type: "number",description: "Id do barbeiro identificado na mensagem identificadora: agendar_barber_x"}
                    }
                }
            }
        },
        {
            type:"function",
            function: {
                name: "find_barber",
                description: "Encontra o barbeiro que o cliente que agendar com base no id do barbeiro a partir da mensagem identificação agendar_barber_1, onde o número no final é o id do barbeiro",
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
        const body = req.body as {prompt: string, telefone: string};
        const prompt: string = body.prompt;
        const telefone: string = body.telefone

        const session = sessionManager.get(telefone)
        let clientUser

        if(!session)
            clientUser = await client.find(telefone)
        
        const step = session?.step
        const nameClient = session?.nameClient

        console.log(session, !step)

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
                    - Seja amigável e carismático, porém breve e rápido.
                    - Execute somente a sua função, se o cliente sair de contexto avise-o que você é somente um assistente especializado em agendamentos e só é capaz de ajuda-lo referente ao seu atendimento.

                    FORMATO DA DATA
                    Sempre produza datas no formato: "YYYY-MM-DD HH:mm".

                    SUA FUNÇÃO AGORA:
                    - ${!step ? "Identificar qual o barbeiro do cliente através do identificador: agendar_barber_1, onde o número no final representa o id do barbeiro" : `${step === "criar_cliente" ? `Cria o cliente pedindo o nome dele de forma rápida, curta e carismática` : `${step === "agendamento" ? `O cliente ${nameClient} está precisando de ajuda no seu agendamento, pergunte o que ele precisa de forma simples e carismática` : `O cliente ${nameClient} já fez seu agendamento, avisa-o se precisar você ajuda ele, isso de forma carismática e rápida`}`}`}
                `},
                {role: "user", content: prompt}
            ],
            tools: this.tools,
            tool_choice: "auto"
        });

        const msg = response.choices[0].message;

        if(msg.tool_calls){
            const call = msg.tool_calls[0];

            if(call.type === "function" && call.function.name === "find_barber"){
                const args = JSON.parse(call.function.arguments!)

                const res = await Tools.findBarber(args.idBarber)
                sessionManager.set(telefone,{idBarber: args.idBarber, step: "criar_cliente"})

                const Secondresponse = await this.secondRequest(msg,call,prompt,true,`O barbeiro foi identificado com o nome de ${res.nameBarber} e você é o agente assistente dele, peça agora de forma carismática e curta o nome do cliente para fazer o agendamento`)

                return reply.status(200).send(Responses.success(Secondresponse.choices[0].message.content as string))
            }
            
            if(call.type === "function" && call.function.name === "create_client"){
                const args = JSON.parse(call.function.arguments!)

                const res: ClientType = await Tools.createClient({telefone, name: args.name, idBarber: session!.idBarber})
                sessionManager.set(telefone,{nameClient: args.name, idClient: res.id, step: "agendamento"})

                const Secondresponse = await this.secondRequest(msg,call,prompt,true,`O cliente ${args.name} esta entrando em contato, peça de forma curta, simples e carismática no que você pode ajudar no agendamento dele`)

                return reply.status(200).send(Responses.success(Secondresponse.choices[0].message.content as string))
            }

            if(call.type === "function" && call.function.name === "create_agenda"){
                const args = JSON.parse(call.function.arguments!);

                const session = sessionManager.get(telefone)

                try{
                    await Tools.createAgenda(session!.idClient,args.date_time,session!.idBarber)

                    const Secondresponse = await this.secondRequest(msg,call,prompt,true,"Agendamento feito com sucesso via seu zé, retorne uma resposta simples, curta e carismática")

                    sessionManager.set(telefone, {step: "desagendamento"})

                    return reply.status(200).send(Responses.success(Secondresponse.choices[0].message.content as string));
                }catch(err){
                    console.error("Erro ao criar agenda via SeuZé:", err);
                    return reply.status(500).send(Responses.error("Ocorreu algum erro ao agendar via SeuZé")); 
                }
            }

            if(call.type === "function" && call.function.name === "delete_schedule"){
                try{
                    const session = sessionManager.get(telefone)
                    Tools.deleteSchedule(session!.idClient,session!.idBarber)
                    
                    const Secondresponse = await this.secondRequest(msg,call,prompt,true,"Desagendamento realizado com sucesso via SeuZé, informe isso ao usuário de forma breve e carismática")

                    sessionManager.set(telefone,{step: "agendamento"})

                    return reply.status(200).send(Responses.success(Secondresponse.choices[0].message.content as string)) 
                }catch(err){
                    console.error("Erro ao desagendar via seu Zé")
                    return reply.status(500).send({message: "Erro ao desagendar via SeuZé"})
                }
            }
        }

        reply.status(200).send(Responses.success(msg.content as string))
    }
    

}