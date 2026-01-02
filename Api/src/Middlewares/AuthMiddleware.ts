import { FastifyReply, FastifyRequest } from "fastify";
import { Responses } from "../Utils/Responses.js";
import { Jwt } from "../Utils/Jwt.js";

export class AuthMiddleware{
    static async verifyToken(req: FastifyRequest, reply: FastifyReply): Promise<void>{
        const authHeader = req.headers.authorization;
        const token = authHeader?.replace("Bearer ", "");

        if(!token){
            return reply.status(401).send(Responses.error("Usuário não autenticado"));
        }

        const decoded = Jwt.verifyToken(token as string, process.env.JWT_SECRET as string);

        if(!decoded){
            return reply.status(401).send(Responses.error("Token inválido ou expirado"));
        }

        req.idBarber = decoded.idBarber
    }
}