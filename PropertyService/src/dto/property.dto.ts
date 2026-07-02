export interface CreatePropertyDTO {
    name: string;
    description?: string;
    address: string;
    city: string;
    state?: string;
    country: string;
    latitude?: number;
    longitude?: number;
    pricePerNight: number;
    maxGuests: number;
    amenities?: string[];
    images?: string[];
    hostId: number;
}
