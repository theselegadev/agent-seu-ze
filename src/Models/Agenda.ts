import { ModelsInterface } from "../Utils/interfaces/ModelsInterface.js";
import { Agenda as AgendaType } from "../Utils/Types.js";
import { AgendaWithClientInfo as AgendaInfo } from "../Utils/Types.js";
import { db } from "../config/db.js";

export class Agenda implements ModelsInterface<AgendaType> {

    async create(agenda: AgendaType): Promise<boolean> {
        const now = new Date().toLocaleString("sv-SE",{
            timeZone: "America/Sao_Paulo",
            hour12: false
        }).replace(/\./g,":")
        
        const dateNow = new Date(now.replace(" ","T"))
        const dateAgenda = new Date(agenda.datetime.replace(" ","T"))

        if(dateAgenda < dateNow)
            return false;
        

        const sql = `INSERT INTO agenda (id_barbeiro, id_cliente, data) VALUES (?,?,?)`;

        try{
            await db.execute(sql, [agenda.barber_id, agenda.client_id, agenda.datetime]);
            return true
        }catch(err){
            console.error("Erro ao criar agenda:", err);
            throw err;
        }
    }

    async findAll<AgendaInfo>(idBarber: number): Promise<AgendaInfo[] | any> {
        const sql = `SELECT c.nome, c.telefone, a.data FROM agenda a INNER JOIN cliente c ON a.id_cliente = c.id WHERE a.id_barbeiro = ?`;

        try{
            const [rows] = await db.execute(sql, [idBarber]);
            return rows as AgendaInfo[];
        }catch(err){
            console.error("Erro ao buscar agendas:", err);
            throw err;
        }
    }

    async delete(idClient: number, idBarber: number): Promise<void>{
        const sql = "DELETE FROM agenda WHERE id_cliente = ? AND id_barbeiro = ?";

        try{
            await db.execute(sql,[idClient,idBarber])
            return
        }catch(err){
            console.error("Erro ao desagendar ", err)
            throw err
        }
    }

    
}