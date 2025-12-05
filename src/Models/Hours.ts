import { db } from "../config/db.js";
import { ModelsInterface } from "../Utils/interfaces/ModelsInterface.js";
import { Hours as HoursType} from "../Utils/Types.js";

export class Hours implements ModelsInterface<HoursType>{
    async create(hour: HoursType): Promise<void>{
        const sql = "INSERT INTO horarios_disponiveis(id_barbeiro,data,hora) VALUES (?,?,?)";

        try{
            await db.execute(sql,[hour.barberId,hour.date,hour.hour]);
        }catch(err){
            console.error("Erro ao cadastra horário: ", err)
            throw err
        }
    }

    async findHoursAvailable(barberId: number, date: string): Promise<object[]>{ 
        const sql = "SELECT hora FROM horarios_disponiveis WHERE id_barbeiro = ? AND data = ?";

        try{
            const [rows] = await db.execute(sql,[barberId, date]);
            return rows as object[];
        }catch(err){
            console.error("Erro ao buscar horários disponíveis: ", err)
            throw err
        }
    }
}