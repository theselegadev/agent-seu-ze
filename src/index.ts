import Fastify from 'fastify';
import dotenv from 'dotenv';

dotenv.config();

import { BarberController } from './Controllers/BarberController.js';
import { ClientController } from './Controllers/ClientController.js';
import { AgendaController } from './Controllers/AgendaController.js';
import { HoursController } from './Controllers/HoursController.js';
import { SeuZe } from './Agent/SeuZe.js';

const app = Fastify();

const barberController = new BarberController();
const clientController = new ClientController();
const agendaController = new AgendaController();
const hoursController = new HoursController()
const seuZe = new SeuZe();

app.post('/barber',barberController.create);
app.post('/barber/login',barberController.login);
app.post('/client',clientController.create);
app.post('/client/login',clientController.login)
app.post('/agenda',agendaController.create);
app.get('/agenda/:idBarber',agendaController.findAll);
app.delete('/agenda/:idClient/:idBarber',agendaController.delete)
app.post('/hours',hoursController.create)
app.post('/prompt',seuZe.getPrompt)

app.listen({ port: 3000 })