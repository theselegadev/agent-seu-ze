import { Barber } from "../Models/Barber.js";
import { ControllerInterface } from "../Utils/interfaces/ControllerInterface.js";
import { Barber as BarberType } from "../Utils/Types.js";
import { FastifyRequest, FastifyReply } from "fastify";
import { Responses } from "../Utils/Responses.js";

export class BarberController implements ControllerInterface<BarberType> {
    model: Barber = new Barber();

    create = async(req: FastifyRequest,reply: FastifyReply): Promise<void> => {

        try{
            await this.model.create(req.body as BarberType);
            return reply.status(201).send(Responses.success("Barbeiro criado com sucesso"));
        }catch(err){
            console.error("Erro ao criar barbeiro", err);
            return reply.status(500).send(Responses.error("Infelizmente ocorreu um erro ao criar conta"));
        }
    }
    update = async (req: object,reply: object): Promise<void> => {
        // await this.model.update();
    }
    login = async (req: FastifyRequest<{Body: {name: string, password: string}}>,reply: FastifyReply): Promise<any> => {
        const res = await this.model.login(req.body.name, req.body.password);

        if(!res)
            return reply.status(401).send(Responses.success("Nome ou senha incorretos"));

        return reply.status(200).send(Responses.error("Login relizado com sucesso"));
    }
}