import { z } from "zod";

export const createBookingSchema = z.object({
    userId: z.number().int().positive(),
    propertyId: z.number().int().positive(),
    totalGuests: z.number().int().min(1).default(1),
    bookingAmount: z.number().positive(),
    checkInDate: z.string().datetime(),
    checkOutDate: z.string().datetime(),
});
