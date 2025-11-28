import Fastify from 'fastify';
import dotenv from 'dotenv';

dotenv.config();

import { BarberController } from './Controllers/BarberController.js';
import { ClientController } from './Controllers/ClientController.js';
import { AgendaController } from './Controllers/AgendaController.js';
import { SeuZe } from './Agent/SeuZe.js';

const app = Fastify();

const barberController = new BarberController();
const clientController = new ClientController();
const agendaController = new AgendaController();
const seuZe = new SeuZe();

app.post('/barber',barberController.create);
app.post('/barber/login',barberController.login);
app.post('/client',clientController.create);
app.post('/client/login',clientController.login)
app.post('/agenda',agendaController.create);
app.get('/agenda/:idBarber',agendaController.findAll);
app.post('/prompt',seuZe.getPrompt)

app.listen({ port: 3000 })