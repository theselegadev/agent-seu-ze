import Fastify from 'fastify';
import dotenv from 'dotenv';
import cors from '@fastify/cors';

dotenv.config();

import { BarberController } from './Controllers/BarberController.js';
import { ClientController } from './Controllers/ClientController.js';
import { AgendaController } from './Controllers/AgendaController.js';
import { HoursController } from './Controllers/HoursController.js';
import { SeuZe } from './Agent/SeuZe.js';
import { AuthMiddleware } from './Middlewares/AuthMiddleware.js';

const app = Fastify();

const barberController = new BarberController();
const clientController = new ClientController();
const agendaController = new AgendaController();
const hoursController = new HoursController()
const seuZe = new SeuZe();

app.register(cors,{
    origin: '*',
    methods: ['GET','POST','DELETE','PUT']
})

app.post('/barber',barberController.create);
app.post('/barber/login',barberController.login);
app.post('/client',{preHandler: AuthMiddleware.verifyToken},clientController.create);
app.post('/agenda',{preHandler: AuthMiddleware.verifyToken},agendaController.create);
app.get('/agenda',{preHandler: AuthMiddleware.verifyToken},agendaController.findAll);
app.delete('/agenda/:idClient',{preHandler: AuthMiddleware.verifyToken},agendaController.delete)
app.post('/hours',{preHandler: AuthMiddleware.verifyToken},hoursController.create)
app.get('/hours',{preHandler: AuthMiddleware.verifyToken},hoursController.getAll);
app.delete('/hours/:id',{preHandler: AuthMiddleware.verifyToken},hoursController.delete)
app.post('/prompt',seuZe.getPrompt)

app.listen({ port: 3000 })