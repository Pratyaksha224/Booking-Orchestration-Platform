export type CreateBookingDTO = {
    userId: number,
    propertyId: number,
    totalGuests: number,
    bookingAmount: number,
    checkInDate: string,
    checkOutDate: string,
}
