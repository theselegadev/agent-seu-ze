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
app.get('/barber',{preHandler: AuthMiddleware.verifyToken},barberController.get);
app.put('/barber',{preHandler: AuthMiddleware.verifyToken},barberController.update);

app.post('/agenda',{preHandler: AuthMiddleware.verifyToken},agendaController.create);
app.get('/agenda',{preHandler: AuthMiddleware.verifyToken},agendaController.findAll);
app.put('/agenda',{preHandler: AuthMiddleware.verifyToken},agendaController.update)
app.delete('/agenda/:idClient',{preHandler: AuthMiddleware.verifyToken},agendaController.delete)

app.post('/hours',{preHandler: AuthMiddleware.verifyToken},hoursController.create)
app.get('/hours',{preHandler: AuthMiddleware.verifyToken},hoursController.getAll);
app.delete('/hours/:id',{preHandler: AuthMiddleware.verifyToken},hoursController.delete)
app.put('/hours/:id',{preHandler: AuthMiddleware.verifyToken},hoursController.update);

app.get('/clients',{preHandler: AuthMiddleware.verifyToken},clientController.getAllbyBarber);
app.post('/clients',{preHandler: AuthMiddleware.verifyToken},clientController.create);
app.put('/clients/:id',{preHandler: AuthMiddleware.verifyToken},clientController.update);

app.post('/prompt',seuZe.getPrompt)

app.listen({ port: 3000 })