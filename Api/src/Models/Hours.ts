import { db } from "../config/db.js";
import { ModelsInterface } from "../Utils/interfaces/ModelsInterface.js";
import { Hours as HoursType} from "../Utils/Types.js";

export class Hours implements ModelsInterface<HoursType>{
    async create(hour: HoursType): Promise<void>{
        const sql = "INSERT INTO horarios_disponiveis(id_barbeiro,data,hora) VALUES (?,?,?)";

        try{
            await db.execute(sql,[hour.idBarber,hour.date,hour.hour]);
        }catch(err){
            console.error("Erro ao cadastra horário: ", err)
            throw err
        }
    }

    async findHoursAvailable(barberId: number, date: string): Promise<object[]>{ 
        const sql = "SELECT hora FROM horarios_disponiveis WHERE id_barbeiro = ? AND data = ? AND disponivel = 1";

        try{
            const [rows] = await db.execute(sql,[barberId, date]);
            return rows as object[];
        }catch(err){
            console.error("Erro ao buscar horários disponíveis: ", err)
            throw err
        }
    }

    async findDateAvailable(barberId: number): Promise<object[]>{
        const sql = "SELECT DISTINCT data FROM horarios_disponiveis WHERE id_barbeiro = ? AND disponivel = 1";

        try{
            const [rows] = await db.execute(sql,[barberId]);
            return rows as object[];
        }catch(err){
            console.error("Erro ao buscar datas disponíveis: ", err)
            throw err
        }
    }

    async getAll(idBarber: number): Promise<HoursType[]>{
        const sql = "SELECT * FROM horarios_disponiveis WHERE id_barbeiro = ?";

        try{
            const [rows] = await db.execute(sql,[idBarber]);
            return rows as HoursType[];
        }catch(err){
            console.error("Erro ao buscar todos os horários: ", err)
            throw err
        }
    }

    async delete(id: number): Promise<void>{
        const sql = "DELETE FROM horarios_disponiveis WHERE id = ?";

        try{
            await db.execute(sql,[id]);
        }catch(err){
            console.error("Erro ao deletar horário: ", err)
            throw err
        }
    }

    async update(item: HoursType): Promise<void>{
        const sql = "UPDATE horarios_disponiveis SET data = ?, hora = ?, disponivel = ? WHERE id = ? and id_barbeiro = ?";

        try{
            await db.execute(sql,[item.date,item.hour,item.available,item.id,item.idBarber]);
        }catch(err){
            console.error("Erro ao atualizar horário: ", err)
            throw err
        }
    }

    async defineUnavailable(date: string, time: string, idBarber: number): Promise<void>{
        const sql = `UPDATE horarios_disponiveis SET disponivel = 0 WHERE data = ? AND hora = ? AND id_barbeiro = ?`;

        try{
            await db.execute(sql,[date,time,idBarber])
            return
        }catch(err){
            console.error("Erro ao definir horário como indisponível: ",err)
            throw err
        }
    }
}