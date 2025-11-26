import { db  } from "../config/db";
import { ModelsInterface } from "../Utils/interfaces/ModelsInterface";
import { Barber as BarberType } from "../Utils/Types";

class Barber implements ModelsInterface<BarberType> {
    async create(data: BarberType): Promise<void> {
        const sql: string = "INSERT INTO barbeiro (nome,telefone,endereco,senha) VALUES (?, ?, ?, ?)";
        try{
            await db.execute(sql, [data.name, data.telefone, data.address, data.password]);
        }catch(err){
            console.error("Erro ao criar barbeiro: ", err);
            throw err;
        }
    }
    async update(data: BarberType): Promise<void> {

    }
    async login(name: string, password: string): Promise<boolean> {
        return true;
    }
}

export {Barber}