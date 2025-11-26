import Fastify from 'fastify';
import dotenv from 'dotenv';

dotenv.config();

import { BarberController } from './Controllers/BarberController.js';

const app = Fastify();
const barberController = new BarberController();



app.post('/barber',barberController.create);

app.listen({ port: 3000 })