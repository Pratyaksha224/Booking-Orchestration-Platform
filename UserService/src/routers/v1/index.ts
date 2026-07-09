import express, { Router } from 'express';

import pingRouter from './ping.router';
import propertyRouter from './property.router';
import authRouter from './auth.router';
import bookingRouter from './booking.router';

const v1Router: Router = express.Router();

v1Router.use('/ping', pingRouter);
v1Router.use('/properties', propertyRouter);
v1Router.use('/auth', authRouter);
v1Router.use('/bookings', bookingRouter);

export default v1Router;