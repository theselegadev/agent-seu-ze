import { db  } from "../config/db.js";
import { ModelsInterface } from "../Utils/interfaces/ModelsInterface.js";
import { Barber as BarberType } from "../Utils/Types.js";
import bcrypt from "bcrypt";

class Barber implements ModelsInterface<BarberType> {
    async create(data: BarberType): Promise<void> {
        const sql: string = "INSERT INTO barbeiro (nome,telefone,endereco,senha) VALUES (?, ?, ?, ?)";
        const hashedPassword = await bcrypt.hash(data.password, 10);
        try{
            await db.execute(sql, [data.name, data.telefone, data.address, hashedPassword]);
        }catch(err){
            console.error("Erro ao criar barbeiro: ", err);
            throw err;
        }
    }
    async update(data: BarberType): Promise<void> {

    }
    async login(name: string, password: string): Promise<boolean> {
        const sql: string = "SELECT senha FROM barbeiro WHERE nome = ?";

        try{
            const [rows] = await db.execute(sql, [name]);
            const users = rows as any[];

            if(users.length === 0)
                return false

            const hashedPassword: string = users[0].senha;
            const isMatch: boolean = await bcrypt.compare(password, hashedPassword);

            return isMatch;
        }catch(err){
            console.error("Erro ao fazer login: ", err);
            throw err;
        }
    }
}

export {Barber}