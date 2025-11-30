import { ModelsInterface } from "../Utils/interfaces/ModelsInterface.js";
import { Client as ClientType } from "../Utils/Types.js";
import { db } from "../config/db.js";

export class Client implements ModelsInterface<ClientType> {
    create = async (client: ClientType): Promise<void> =>{
        const sql = `INSERT INTO cliente (nome, telefone) VALUES (?,?)`;

        try{
            await db.execute(sql, [client.name, client.telefone]);
            return
        }catch(err){
            console.error("Erro ao criar cliente:", err);
            throw err;
        }
    }

    update = async(client: ClientType): Promise<void> =>{
        
    }
}