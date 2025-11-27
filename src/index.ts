import Fastify from 'fastify';
import dotenv from 'dotenv';

dotenv.config();

import { BarberController } from './Controllers/BarberController.js';
import { ClientController } from './Controllers/ClientController.js';

const app = Fastify();
const barberController = new BarberController();
const clientController = new ClientController();

app.post('/barber',barberController.create);
app.post('/barber/login',barberController.login);
app.post('/client',clientController.create);

app.listen({ port: 3000 })