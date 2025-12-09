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
            const idBarber = await this.model.create(req.body as BarberType);
            const token = Jwt.generateToken({name: (req.body as BarberType).name}, process.env.JWT_SECRET as string);
            return reply.status(201).send(Responses.success("Barbeiro criado com sucesso", [{idBarber, token}]));
        }catch(err){
            console.error("Erro ao criar barbeiro", err);
            return reply.status(500).send(Responses.error("Infelizmente ocorreu um erro ao criar conta"));
        }
    }

    login = async (req: FastifyRequest<{Body: {name: string, password: string}}>,reply: FastifyReply): Promise<any> => {
        const res = await this.model.login(req.body.name, req.body.password);

        if(!res)
            return reply.status(401).send(Responses.error("Nome ou senha incorretos"));

        const token = Jwt.generateToken({name: req.body.name}, process.env.JWT_SECRET as string);
        return reply.status(200).send(Responses.success("Login relizado com sucesso",[{idBarber: res, token}]));
    }
}