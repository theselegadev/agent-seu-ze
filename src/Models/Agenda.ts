import { ModelsInterface } from "../Utils/interfaces/ModelsInterface.js";
import { Agenda as AgendaType } from "../Utils/Types.js";
import { db } from "../config/db.js";

export class Agenda implements ModelsInterface<AgendaType> {
    async create(agenda: AgendaType): Promise<void> {
        const sql = `INSERT INTO agenda (id_barbeiro, id_cliente, data) VALUES (?,?,?)`;

        try{
            await db.execute(sql, [agenda.barber_id, agenda.client_id, agenda.datetime]);
            return
        }catch(err){
            console.error("Erro ao criar agenda:", err);
            throw err;
        }
    }
}