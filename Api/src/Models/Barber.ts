import { db  } from "../config/db.js";
import { FieldPacket, QueryResult, ResultSetHeader } from "mysql2";
import { ModelsInterface } from "../Utils/interfaces/ModelsInterface.js";
import { Barber as BarberType } from "../Utils/Types.js";
import bcrypt from "bcrypt";

class Barber implements ModelsInterface<BarberType> {
    async create(data: BarberType): Promise<number> {
        const sql: string = "INSERT INTO barbeiro (nome,telefone,endereco,senha) VALUES (?, ?, ?, ?)";
        const hashedPassword = await bcrypt.hash(data.password, 10);

        try{
           const [result] = await db.execute<ResultSetHeader>(sql, [data.name, data.telefone, data.address, hashedPassword]);
           return result.insertId as number;
        }catch(err){
            console.error("Erro ao criar barbeiro: ", err);
            throw err;
        }
    }

    async find(idBarber: number): Promise<BarberType> {
        const sql = "SELECT id,nome,endereco,telefone FROM barbeiro WHERE id = ?";

        try{
            const [rows]: any = await db.execute(sql,[idBarber])
            if(rows){
                return rows[0] as BarberType
            }

            return [] as unknown as BarberType
        }catch(err){
            console.error("Ocorreu um erro ao encontrar o barbeiro: ", err)
            throw err
        }
    }

    async update(data: BarberType): Promise<void> {
        const sql: string = "UPDATE barbeiro SET nome = ?, telefone = ?, endereco = ? WHERE id = ?";

        try{
            await db.execute(sql, [data.name, data.telefone, data.address, data.id]);
        }catch(err){
            console.error("Erro ao atualizar barbeiro: ", err);
            throw err;
        }
    }
    
    async login(name: string, password: string): Promise<number | boolean> {
        const sql: string = "SELECT id,senha FROM barbeiro WHERE nome = ?";

        try{
            const [rows] = await db.execute(sql, [name]);
            const users = rows as any[];

            if(users.length === 0)
                return false

            const hashedPassword: string = users[0].senha;
            const idBarber: number = users[0].id;
            const isMatch: boolean = await bcrypt.compare(password, hashedPassword);

            if(!isMatch)
                return false;

            return idBarber;
        }catch(err){
            console.error("Erro ao fazer login: ", err);
            throw err;
        }
    }

    async isNameUnique(name: string): Promise<boolean> {
        const sql: string = "SELECT id FROM barbeiro WHERE nome = ?";

        try{
            const [rows] = await db.execute(sql, [name]);
            return (rows as QueryResult[]).length === 0;
        }catch(err){
            console.error("Erro ao verificar nome único: ", err);
            throw err;
        }
    }

    async isPhoneUnique(telefone: string): Promise<boolean> {
        const sql: string = "SELECT id FROM barbeiro WHERE telefone = ?";

        try{
            const [rows] = await db.execute(sql, [telefone]);
            return (rows as QueryResult[]).length === 0;
        }catch(err){
            console.error("Erro ao verificar telefone único: ", err);
            throw err;
        }
    }
}

export {Barber}