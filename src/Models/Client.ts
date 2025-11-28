import { ModelsInterface } from "../Utils/interfaces/ModelsInterface.js";
import { Client as ClientType } from "../Utils/Types.js";
import { db } from "../config/db.js";
import bcrypt from "bcrypt";

export class Client implements ModelsInterface<ClientType> {
    create = async (client: ClientType): Promise<void> =>{
        const sql = `INSERT INTO cliente (nome, telefone, senha, email) VALUES (?,?,?,?)`;

        try{
            const hashedPassword: string = await bcrypt.hash(client.password,10) 
            await db.execute(sql, [client.name, client.telefone,hashedPassword,client.email]);
            return
        }catch(err){
            console.error("Erro ao criar cliente:", err);
            throw err;
        }
    }

    login = async(email: string, password: string): Promise<boolean> => {
        const sql = "SELECT senha FROM cliente WHERE email = ?";

        try{
            const [rows] = await db.execute(sql,[email]);

            const users = rows as any[]
            
            if(users.length === 0)
                return false

            const hashedPassword: string = users[0].senha
            const isMatch = await bcrypt.compare(password,hashedPassword)

            if(isMatch)
                return true
            return false
        }catch(err){
            console.error("Erro ao fazer login", err)
            throw err
        }
    }

    update = async(client: ClientType): Promise<void> =>{
        
    }
}