import { ModelsInterface } from "../Utils/interfaces/ModelsInterface.js";
import { Agenda as AgendaType } from "../Utils/Types.js";
import { AgendaWithClientInfo as AgendaInfo } from "../Utils/Types.js";
import { db } from "../config/db.js";
import { DateValidator } from "../Utils/DateValidator.js";

export class Agenda implements ModelsInterface<AgendaType> {

    async verifyDateTime(date: string, time: string, idBarber: number): Promise<boolean> {
        const sql = `SELECT * FROM horarios_disponiveis WHERE data = ? AND hora = ? AND id_barbeiro = ? AND disponivel = 1`;
        
        try{
            const [rows]: any = await db.execute(sql, [date, time, idBarber]);
            return rows.length > 0;
        }catch(err){
            console.error("Erro ao verificar data e hora:", err);
            throw err;
        }
    }

    async create(agenda: AgendaType): Promise<boolean> {        
        if(!DateValidator.isAfterNow(agenda.datetime))
            return false;

        const [date, time] = agenda.datetime.split(" ");
        const res = await this.verifyDateTime(date, time, agenda.idBarber)

        if(!res) return false

        const sql = `INSERT INTO agenda (id_barbeiro, id_cliente, data) VALUES (?,?,?)`;

        try{
            await db.execute(sql, [agenda.idBarber, agenda.idClient, agenda.datetime]);

            const sqlUpdate = `UPDATE horarios_disponiveis SET disponivel = 0 WHERE data = ? AND hora = ? AND id_barbeiro = ?`;
            
            await db.execute(sqlUpdate, [date, time, agenda.idBarber]);
            return true
        }catch(err){
            console.error("Erro ao criar agenda:", err);
            throw err;
        }
    }

    async update(entity: AgendaType): Promise<boolean> {
        if(!DateValidator.isAfterNow(entity.datetime))
            return false;

        const [date, time] = entity.datetime.split(" ");
        const res = await this.verifyDateTime(date, time, entity.idBarber)

        if(!res) return false

        const sql = `UPDATE agenda SET id_cliente = ?, data = ? WHERE id_barbeiro = ? AND id = ?`

        try{
            await db.execute(sql,[entity.idClient,entity.datetime,entity.idBarber, entity.id])

            const sqlUpdate = `UPDATE horarios_disponiveis SET disponivel = 0 WHERE data = ? AND hora = ? AND id_barbeiro = ?`;
            
            await db.execute(sqlUpdate, [date, time, entity.idBarber]);

            return true
        }catch(err){
            console.error("Erro ao atualizar agenda: ", err)
            throw err
        }
    }

    async findAll<AgendaInfo>(idBarber: number): Promise<AgendaInfo[] | any> {
        const sql = `SELECT a.id ,c.id as id_cliente, c.nome, c.telefone, a.data FROM agenda a INNER JOIN cliente c ON a.id_cliente = c.id WHERE a.id_barbeiro = ?`;

        try{
            const [rows] = await db.execute(sql, [idBarber]);
            return rows as AgendaInfo[];
        }catch(err){
            console.error("Erro ao buscar agendas:", err);
            throw err;
        }
    }

    async delete(idClient: number, idBarber: number, id: number | null = null): Promise<void>{
        const sql = `DELETE FROM agenda WHERE id_cliente = ? AND id_barbeiro = ? ${id ? "AND id = ?" : ""}`;
        const params: number[] = [idClient,idBarber]
        
        if(id) params.push(id)

        try{
            await db.execute(sql,[idClient,idBarber, id])
            return
        }catch(err){
            console.error("Erro ao desagendar ", err)
            throw err
        }
    }   
}