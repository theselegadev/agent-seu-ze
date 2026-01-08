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
        const sql = `SELECT c.*, b.nome AS nameBarber FROM cliente c INNER JOIN barbeiro b ON c.id_barbeiro = b.id WHERE c.telefone = ?`;

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
    
    getAllByBarber = async (idBarber: number): Promise<ClientType[]> => {
        const sql = `SELECT * FROM cliente WHERE id_barbeiro = ?`;

        try{
            const [rows] = await db.execute(sql,[idBarber])
            return rows as ClientType[]
        }catch(err){
            console.error("Ocorreu algum erro ao listar clientes ", err)
            throw err
        }
    }

    update = async(client: ClientType): Promise<void> =>{
        const sql = `UPDATE cliente SET nome = ?, telefone = ? WHERE id = ? and id_barbeiro = ?`;

        try{ 
            await db.execute(sql, [client.name, client.telefone, client.id, client.idBarber]);
        }catch(err){
            console.error("Erro ao atualizar cliente:", err);
            throw err;
        }
    }
}