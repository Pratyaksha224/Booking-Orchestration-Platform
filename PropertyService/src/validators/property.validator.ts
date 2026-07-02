import { z } from "zod";

export const createPropertySchema = z.object({
    name: z.string().min(1, "Name is required"),
    description: z.string().optional(),
    address: z.string().min(1, "Address is required"),
    city: z.string().min(1, "City is required"),
    state: z.string().optional(),
    country: z.string().min(1, "Country is required"),
    latitude: z.number().optional(),
    longitude: z.number().optional(),
    pricePerNight: z.number().positive("Price must be positive"),
    maxGuests: z.number().int().min(1, "At least 1 guest required"),
    amenities: z.array(z.string()).optional(),
    images: z.array(z.string()).optional(),
    hostId: z.number().int().positive("Host ID is required")
});
