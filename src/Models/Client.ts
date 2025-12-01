import { ModelsInterface } from "../Utils/interfaces/ModelsInterface.js";
import { Client as ClientType } from "../Utils/Types.js";
import { db } from "../config/db.js";

export class Client implements ModelsInterface<ClientType> {
    create = async (client: ClientType): Promise<boolean> =>{
        const sqlFilter = "SELECT * FROM cliente WHERE telefone = ?"

        try{
            const [rows]: any = await db.execute(sqlFilter,[client.telefone]);
            
            if(rows.length > 0)
                return false
            
        }catch(err){
            console.error("Ocorreu um erro ao verificar se o cliente já existe ",err)
            return false
        }

        const sql = `INSERT INTO cliente (nome, telefone) VALUES (?,?)`;

        try{
            await db.execute(sql, [client.name, client.telefone]);
            return true
        }catch(err){
            console.error("Erro ao criar cliente:", err);
            throw err;
        }
    }

    update = async(client: ClientType): Promise<void> =>{
        
    }
}