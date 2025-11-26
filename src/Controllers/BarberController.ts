import { Barber } from "../Models/Barber.js";
import { ControllerInterface } from "../Utils/interfaces/ControllerInterface.js";
import { Barber as BarberType } from "../Utils/Types.js";
import { FastifyRequest, FastifyReply } from "fastify";

export class BarberController implements ControllerInterface<BarberType> {
    model: Barber = new Barber();

    create = async(req: FastifyRequest,reply: FastifyReply): Promise<void> => {

        try{
            await this.model.create(req.body as BarberType);
            return reply.status(201).send({message: "Barbeiro criado com sucesso"});
        }catch(err){
            console.error("Erro ao criar barbeiro", err);
            return reply.status(500).send({error: "Erro ao criar barbeiro"});
        }
    }
    update = async (req: object,reply: object): Promise<void> => {
        // await this.model.update();
    }
    login = async (req: object,reply:object): Promise<boolean> => {
        return await new Promise((resolve, reject) => {
            resolve(true);
        });
    }
}