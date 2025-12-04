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
                description: "Cria um cliente com base no nome que ele enviou",
                parameters: {
                    type:"object",
                    properties:{
                        name: {type: "string",description:"Nome do cliente que esta entrando em contato com o barbeiro"},
                        idBarber: {type: "number",description: "Id do barbeiro"}
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
        },
        {
            type: "function",
            function: {
                name: "extract_date",
                description: "Identifica a data do agendamento quando o cliente só enviar ela, sem o horário somente a data. Exemplo: quero agendar amanhã",
                parameters: {
                    type: "object",
                    properties: {
                        date: {type: "string", description: "Data do agendamento no formato YYYY-MM-DD"}
                    },
                    required: ["date"]
                }
            }
        },
        {
            type: "function",
            function: {
                name: "extract_time",
                description: "Identifica o horário do agendamento quando o cliente só enviar ele, sem a data somente o horário. Exemplo: no horário das 10 e meia",
                parameters: {
                    type: "object",
                    properties: {
                        time: {type: "string", description: "Horário do agendamento no formato HH:mm"}
                    },
                    required: ["time"]
                }
            }
        }
    ]

    constructor(){
        this.client = new OpenAI({
            apiKey: process.env.OPEN_AI_KEY
        });
    }

    secondRequest = async (msg: ChatCompletionMessage,call:ChatCompletionMessageToolCall, status: object, content: string) => {
        const Secondresponse = await this.client.chat.completions.create({
            model: "gpt-4.1",
            messages:[
                {
                role: "assistant",
                content: msg.content ?? null,
                tool_calls: msg.tool_calls
                },
                {role:"tool",tool_call_id: call.id, content: JSON.stringify(status)},
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

        let session = sessionManager.get(telefone)
        let clientUser: any

        if(session == undefined){
            clientUser = await client.find(telefone)

            if(clientUser)
                sessionManager.set(telefone,{idBarber: clientUser?.id_barbeiro,nameClient: clientUser.nome,idClient: clientUser?.id,step:"indefinido", nameBarber: clientUser.nameBarber})
        }
        
        session = sessionManager.get(telefone)
        const step = session?.step
        const nameClient = session?.nameClient
        const nameBarber = session?.nameBarber

        console.log(session)

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
                    - Só extraia a data e o time quando eles forem mandados sozinhos pelo usuário, nunca extraia ambos juntos, se a data e o horario forem mandados juntos apenas crie a agenda.
                    - Só execute uma ferramenta por interação, nunca mais de uma.

                    FORMATO DA DATA
                    - Sempre produza datas no formato: "YYYY-MM-DD HH:mm".
                    - Quando for retornar resposta para o cliente nunca mostre o formato "YYYY-MM-DD HH:mm", sempre converta para um formato amigável como "DD/MM às HH:mm".

                    SUAS FUNÇÕES DISPONÍVEIS:
                    - find_barber: Usada para identificar o barbeiro do cliente através do identificador: agendar_barber_1, onde o número no final representa o id do barbeiro.
                    - create_client: Usada para criar o cliente pedindo o nome dele de forma rápida, curta e carismática, assim com o nome do cliente você deve criar o cliente.
                    - create_agenda: Usada para criar o agendamento do cliente com o barbeiro na data e hora especificados, utilizado sempre que a data e o horário forem identificados na mesma mensagem.
                    - delete_schedule: Usada para deletar o agendamento do cliente se ele já tiver um agendamento realizado.
                    - extract_date: Usada para identificar a data do agendamento quando o cliente só enviar ela, sem o horário, somente quando a data for identificada na mensagem.
                    - extract_time: Usada para identificar o horário do agendamento quando o cliente só enviar ele, sem a data, somente quando o horario for identificado.

                    SUA FUNÇÃO AGORA:
                    - ${!step ? "Identificar qual o barbeiro do cliente através do identificador: agendar_barber_1, onde o número no final representa o id do barbeiro" : `${step === "criar_cliente" ? `Criar o cliente pedindo o nome dele de forma rápida, curta e carismática, assim com o nome do cliente você deve cadastrar o cliente` : `${step === "agendamento" ? `O cliente ${nameClient} está precisando de ajuda no seu agendamento, pergunte o que ele precisa de forma simples e carismática` : `${step === "indefinido" ? `O cliente ${nameClient} está entrando em contato e o barbeiro dele é o ${nameBarber}, pergunte se ele precisa de ajuda em algo referente ao seu agendamento de forma carismática e rápida ou interprete o que ele precisa e execute.`: `O cliente ${nameClient} já fez seu agendamento, avisa-o para caso ele precise de você para ajuda ele, isso de forma carismática e rápida`}`}`}`}
                `},
                {role: "user", content: prompt}
            ],
            tools: this.tools,
            tool_choice: "auto",
            parallel_tool_calls: false
        });

        const msg = response.choices[0].message;
        console.log(msg.tool_calls)

        if(msg.tool_calls){
            const call = msg.tool_calls[0];

            if(call.type === "function" && call.function.name === "find_barber"){
                const args = JSON.parse(call.function.arguments!)

                const res = await Tools.findBarber(args.idBarber)
                sessionManager.set(telefone,{idBarber: args.idBarber, nameBarber: res.nameBarber, step: "criar_cliente"})

                const Secondresponse = await this.secondRequest(msg,call,{status: true},`O barbeiro foi identificado com o nome de ${res.nameBarber} e você é o agente assistente dele, peça agora de forma carismática e curta o nome do cliente para fazer o agendamento`)

                return reply.status(200).send(Responses.success(Secondresponse.choices[0].message.content as string))
            }
            
            if(call.type === "function" && call.function.name === "create_client"){
                const args = JSON.parse(call.function.arguments!)

                const res: ClientType = await Tools.createClient({telefone, name: args.name, idBarber: session!.idBarber})
                sessionManager.set(telefone,{nameClient: args.name, idClient: res.id, step: "agendamento"})

                const Secondresponse = await this.secondRequest(msg,call,{status: true},`O cliente ${args.name} acabou de ser cadastrado, peça de forma curta, simples e carismática no que você pode ajudar no agendamento dele`)

                return reply.status(200).send(Responses.success(Secondresponse.choices[0].message.content as string))
            }

            if(call.type === "function" && call.function.name === "create_agenda"){
                const args = JSON.parse(call.function.arguments!);

                const session = sessionManager.get(telefone)

                try{
                    const res = await Tools.createAgenda(session!.idClient,args.date_time,session!.idBarber)
                    let message, status
                    console.log(res)

                    if(!res){
                        message = "Infelizmente não foi possível criar o agendamento na data e hora solicitadas, pois elas estão indisponiveis. informe isso ao cliente de forma carismática e rápida" 
                        status = {status: false, error: "Horário indisponível"}   
                    }else{
                        message = "Agendamento feito com sucesso via seu zé, retorne uma resposta simples, curta e carismática"
                        status = {status: true}
                        sessionManager.set(telefone, {step: "desagendamento"})
                    }

                    console.log("Fazendo agendamento via SeuZé")

                    const Secondresponse = await this.secondRequest(msg,call,status,message)


                    return reply.status(200).send(Responses.success(Secondresponse.choices[0].message.content as string));
                }catch(err){
                    console.error("Erro ao criar agenda via SeuZé:", err);
                    return reply.status(500).send(Responses.error("Ocorreu algum erro ao agendar via SeuZé")); 
                }
            }

            if(call.type === "function" && call.function.name === "delete_schedule"){
                try{
                    const session = sessionManager.get(telefone)
                    console.log(session!.idClient,session!.idBarber)
                    Tools.deleteSchedule(session!.idClient,session!.idBarber)
                    
                    const Secondresponse = await this.secondRequest(msg,call,{status:true},"Desagendamento realizado com sucesso via SeuZé, informe isso ao usuário de forma breve e carismática")

                    sessionManager.set(telefone,{step: "indefinido"})

                    return reply.status(200).send(Responses.success(Secondresponse.choices[0].message.content as string)) 
                }catch(err){
                    console.error("Erro ao desagendar via seu Zé")
                    return reply.status(500).send({message: "Erro ao desagendar via SeuZé"})
                }
            }

            if(call.type === "function" && call.function.name === "extract_date"){
                const args = JSON.parse(call.function.arguments)

                sessionManager.set(telefone,{date: args.date})
                const session = sessionManager.get(telefone)

                let secondResponse

                if(!session?.time){
                    secondResponse = await this.secondRequest(msg,call,{status:true},`O cliente ${session?.nameClient} enviou somente a data do agendamento, peça de forma carismática e rápida que seria o horário que ele quer marcar no dia`)

                    console.log("Pedindo o horário")

                    sessionManager.set(telefone,{step: "agendamento"})

                    return reply.status(200).send(Responses.success(secondResponse.choices[0].message.content as string))
                }
                
                const datetime = session?.date + " " + session?.time


                await Tools.createAgenda(session.idClient,datetime, session.idBarber)

                secondResponse = await this.secondRequest(msg,call,{status: true},`O cliente ${session?.nameClient} realizou seu agendamento com o sucesso, avise-o de forma carismática e rápida`)

                console.log("Fazendo agendamento")

                sessionManager.set(telefone,{step: "desagendamento"})

                return reply.status(200).send(Responses.success(secondResponse.choices[0].message.content as string))
            }

            if(call.type === "function" && call.function.name === "extract_time"){
                const args = JSON.parse(call.function.arguments)
                
                sessionManager.set(telefone,{time: args.time})

                const session = sessionManager.get(telefone)
                let secondResponse

                if(!session?.date){
                    secondResponse = await this.secondRequest(msg,call,{status: true}, `O cliente ${session?.nameClient} enviou somente o horário do seu agendamento, peça para ele de forma educada, rápida e carismática o dia do seu agendamento`)
                    
                    console.log("Pedindo a data")

                    sessionManager.set(telefone,{step: "agendamento"})

                    return reply.status(200).send(Responses.success(secondResponse.choices[0].message.content as string))
                }

                const datetime = session?.date + " " + session?.time


                await Tools.createAgenda(session.idClient,datetime, session.idBarber)

                secondResponse = await this.secondRequest(msg,call,{status:true},`O cliente ${session?.nameClient} realizou seu agendamento com o sucesso, avise-o de forma carismática e rápida`)

                console.log("Fazendo agendamento")

                sessionManager.set(telefone,{step: "desagendamento"})

                return reply.status(200).send(Responses.success(secondResponse.choices[0].message.content as string))
            }
        }

        reply.status(200).send(Responses.success(msg.content as string))
    }   
}