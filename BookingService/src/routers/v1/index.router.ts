import express from 'express';

import pingRouter from './ping.router';
import BookingRouter from './booking.router';

const v1Router = express.Router();



v1Router.use('/ping',  pingRouter);
console.log("Imported BookingRouter:", BookingRouter);
v1Router.use('/bookings',  BookingRouter);

export default v1Router;