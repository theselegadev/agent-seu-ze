import { Agenda } from "../../Models/Agenda.js"
const agenda = new Agenda()

export class Tools{
    async createAgenda(idClient: number,dateTime: string,idBaber: number){
        try{
            await agenda.create({client_id: idClient,datetime: dateTime,barber_id: idBaber})  
        }catch(err){
            console.error("Erro ao criar agenda via ferramenta:", err);
            throw err;
        }
    }

    async deleteSchedule(idClient: number, idBarber: number){
        try{
            await agenda.delete(idClient,idBarber);
        }catch(err){
            console.error("Erro ao desmarcar o agendamento ",err)
            throw err
        }
    }
}