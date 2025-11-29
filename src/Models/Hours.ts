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
}