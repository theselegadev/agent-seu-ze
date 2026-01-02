import "fastify"

declare module "fastify"{
    interface FastifyRequest{
        idBarber: number
    }
}