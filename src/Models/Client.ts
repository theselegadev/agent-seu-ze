import { ModelsInterface } from "../Utils/interfaces/ModelsInterface.js";
import { Client as ClientType } from "../Utils/Types.js";
import { db } from "../config/db.js";

export class Client implements ModelsInterface<ClientType> {
    create = async (client: ClientType): Promise<ClientType> =>{
        const sql = `INSERT INTO cliente (nome, telefone, id_barbeiro) VALUES (?,?,?)`;

        try{
            const [result]: any = await db.execute(sql, [client.name, client.telefone, client.idBarber]);
            
            return {
                id: result.insertId,
                name: client.name,
                telefone: client.telefone,
                idBarber: client.idBarber
            }
        }catch(err){
            console.error("Erro ao criar cliente:", err);
            throw err;
        }
    }

    find = async (telefone: string): Promise<ClientType | null> => {
        const sql = `SELECT * FROM cliente WHERE telefone = ?`;

        try{
            const [rows] = await db.execute(sql,[telefone])
            const clients = rows as ClientType[]

            if(clients.length > 0)
                return clients[0]

            return null
        }catch(err){
            console.error("Ocorreu algum erro ao encontrar cliente ", err)
            return null
        }
    }   
}