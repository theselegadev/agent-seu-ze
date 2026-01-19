import { Agenda } from "../../Models/Agenda.js"
import { Client } from "../../Models/Client.js";
import { Barber } from "../../Models/Barber.js";
import { Hours } from "../../Models/Hours.js";
import {Client as ClientType} from "../../Utils/Types.js"
import {Barber as BarberType} from "../../Utils/Types.js"

const agenda = new Agenda()
const client = new Client()
const barber = new Barber()
const hours = new Hours()

export class Tools{
    static async createAgenda(idClient: number,dateTime: string,idBaber: number){
        try{
            const res = await agenda.create({client_id: idClient,datetime: dateTime,idBarber: idBaber})
            return res  
        }catch(err){
            console.error("Erro ao criar agenda via ferramenta:", err);
            throw err;
        }
    }

    static async deleteSchedule(idClient: number, idBarber: number){
        console.log("entrou aqui")
        try{
            await agenda.delete(idClient,idBarber);
        }catch(err){
            console.error("Erro ao desmarcar o agendamento ",err)
            throw err
        }
    }

    static async createClient(clientData: ClientType): Promise<ClientType>{
        try{
            const res = await client.create(clientData)

            return res
        }catch(err){
            console.error("Ocorreu um erro ao criar cliente via ferramenta ",err)
            throw err
        }
    }

    static async findBarber(idBarber: number): Promise<{idBarber: number, nameBarber: string} | null>{
        const res: BarberType = await barber.find(idBarber)
        
        if(!res)
            return null;

        return {idBarber: res.id as number, nameBarber: res.name}
    }

    static async findHoursAvailable(barberId: number, date: string): Promise<object[]>{
        const res = await hours.findHoursAvailable(barberId, date)
        return res
    }

    static async findDateAvailable(barberId: number): Promise<object[]>{
        const res = await hours.findDateAvailable(barberId)
        return res
    }
}