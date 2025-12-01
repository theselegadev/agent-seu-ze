import { Agenda } from "../../Models/Agenda.js"
import { Client } from "../../Models/Client.js";
import {Client as ClientType} from "../../Utils/Types.js"

const agenda = new Agenda()
const client = new Client()

export class Tools{
    static async createAgenda(idClient: number,dateTime: string,idBaber: number){
        try{
            await agenda.create({client_id: idClient,datetime: dateTime,barber_id: idBaber})  
        }catch(err){
            console.error("Erro ao criar agenda via ferramenta:", err);
            throw err;
        }
    }

    static async deleteSchedule(idClient: number, idBarber: number){
        try{
            await agenda.delete(idClient,idBarber);
        }catch(err){
            console.error("Erro ao desmarcar o agendamento ",err)
            throw err
        }
    }

    static async createClient(clientData: ClientType): Promise<boolean>{
        try{
            const res = await client.create(clientData)

            if(!res)
                return false

            return true
        }catch(err){
            console.error("Ocorreu um erro ao criar cliente via ferramenta ",err)
            return false
        }
    }
}