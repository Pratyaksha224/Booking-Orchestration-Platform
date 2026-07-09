import express from 'express';
import { 
    createBookingHandler,
    confirmBookingHandler,
    getBookingByIdHandler,
    getUserBookingsHandler,
    cancelBookingHandler
} from '../../controllers/booking.controller';
import { requireAuth } from '../../middlewares/auth.middleware';

import logger from '../../config/logger.config';
const BookingRouter = express.Router();
logger.info("Booking router is initializing...");

BookingRouter.use(requireAuth);

BookingRouter.post('/', createBookingHandler);
BookingRouter.get('/', (req, res) => { res.send("Booking Router works!"); });
BookingRouter.post('/confirm/:idempotencyKey', confirmBookingHandler);
BookingRouter.get('/:id', getBookingByIdHandler);
BookingRouter.get('/user/:userId', getUserBookingsHandler);
BookingRouter.post('/cancel/:id', cancelBookingHandler);

export default BookingRouter;
