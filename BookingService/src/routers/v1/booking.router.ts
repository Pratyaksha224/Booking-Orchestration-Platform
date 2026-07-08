import express from 'express';

import { 
    confirmBookingHandler, 
    createBookingHandler,
    getBookingByIdHandler,
    getUserBookingsHandler,
    cancelBookingHandler
} from '../../controllers/booking.controller';
import { createBookingSchema } from '../../validators/booking.validator';
import { validateRequestBody } from '../../validators';
import { internalAuthMiddleware } from '../../middlewares/internalAuth.middleware';

const BookingRouter = express.Router();

BookingRouter.use(internalAuthMiddleware);

BookingRouter.get('/test', (req, res) => { res.send("Booking Router works locally"); });
BookingRouter.post('/', validateRequestBody(createBookingSchema), createBookingHandler); 
BookingRouter.post('/confirm/:idempotencyKey', confirmBookingHandler); 
BookingRouter.get('/:id', getBookingByIdHandler);
BookingRouter.get('/user/:userId', getUserBookingsHandler);
BookingRouter.post('/cancel/:id', cancelBookingHandler);

export default BookingRouter;