import { Barber } from "../Models/Barber.js";
import { ControllerInterface } from "../Utils/interfaces/ControllerInterface.js";
import { Barber as BarberType } from "../Utils/Types.js";
import { FastifyRequest, FastifyReply } from "fastify";
import { Responses } from "../Utils/Responses.js";
import { Jwt } from "../Utils/Jwt.js";

export class BarberController implements ControllerInterface<BarberType> {
    model: Barber = new Barber();

    create = async(req: FastifyRequest,reply: FastifyReply): Promise<void> => {
        try{
            const name: string = (req.body as BarberType).name;
            const isUniqueName: boolean = await this.model.isNameUnique(name);
            
            const telefone: string = (req.body as BarberType).telefone;
            const isUniquePhone: boolean = await this.model.isPhoneUnique(telefone);

            if(!isUniqueName)
                return reply.status(409).send(Responses.error("O nome utilizado já existe, utilize outro nome"));

            if(!isUniquePhone)
                return reply.status(409).send(Responses.error("O telefone utilizado já existe, utilize outro telefone"));

            const idBarber: number = await this.model.create(req.body as BarberType);
            const token = Jwt.generateToken({name: (req.body as BarberType).name, idBarber}, process.env.JWT_SECRET as string);
            return reply.status(201).send(Responses.success("Barbeiro criado com sucesso", [{token}]));
        }catch(err){
            console.error("Erro ao criar barbeiro", err);
            return reply.status(500).send(Responses.error("Infelizmente ocorreu um erro ao criar conta"));
        }
    }

    login = async (req: FastifyRequest<{Body: {name: string, password: string}}>,reply: FastifyReply): Promise<any> => {
        try{

            const res: number | boolean = await this.model.login(req.body.name, req.body.password);
    
            if(!res)
                return reply.status(401).send(Responses.error("Nome ou senha incorretos"));
    
            const token = Jwt.generateToken({name: req.body.name, idBarber: res as number}, process.env.JWT_SECRET as string);
            return reply.status(200).send(Responses.success("Login relizado com sucesso",[{token}]));
        }catch(err){
            console.error("Ocorreu algum erro ao fazer login: ", err)
            return reply.status(500).send(Responses.error("Infelizmente ocorreu algum erro ao fazer login"))
        }
    }

    get = async (req: FastifyRequest, reply: FastifyReply): Promise<BarberType> => {
        const id: number = req.idBarber;
        try{
            const res: BarberType = await this.model.find(id);
            return reply.status(200).send(Responses.success("Barbeiro encontrado", [res]));
        }catch(err){
            console.error("Erro ao encontrar barbeiro", err);
            return reply.status(500).send(Responses.error("Infelizmente ocorreu um erro ao encontrar barbeiro"));
        }
    }

    update = async(req: FastifyRequest, reply: FastifyReply): Promise<void> =>{
        const body: BarberType = req.body as BarberType;
        body.id = req.idBarber;

        try{
            await this.model.update(body)
            return reply.status(200).send(Responses.success("Dados atualizados com sucesso"))
        }catch(err){
            console.log("Erro ao atualizar os dados ", err)
            return reply.status(500).send(Responses.error("Erro ao atualizar dados"))
        }
    }
}