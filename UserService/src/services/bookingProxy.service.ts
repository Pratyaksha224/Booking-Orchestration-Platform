import axios from 'axios';

const BOOKING_SERVICE_URL = 'http://localhost:3001/api/v1/bookings';

export const createBookingProxy = async (bookingData: any, userId: number, correlationId: string, role: string) => {
    // Inject userId into body since BookingService expects it in the body
    bookingData.userId = userId;
    
    const response = await axios.post(`${BOOKING_SERVICE_URL}`, bookingData, {
        headers: {
            'x-user-id': userId.toString(),
            'x-user-role': role,
            'x-correlation-id': correlationId,
        }
    });
    return response.data;
}

export const confirmBookingProxy = async (idempotencyKey: string, userId: number, correlationId: string, role: string) => {
    const response = await axios.post(`${BOOKING_SERVICE_URL}/confirm/${idempotencyKey}`, {}, {
        headers: {
            'x-user-id': userId.toString(),
            'x-user-role': role,
            'x-correlation-id': correlationId,
        }
    });
    return response.data;
}

export const getBookingByIdProxy = async (id: number, userId: number, correlationId: string, role: string) => {
    const response = await axios.get(`${BOOKING_SERVICE_URL}/${id}`, {
        headers: {
            'x-user-id': userId.toString(),
            'x-user-role': role,
            'x-correlation-id': correlationId,
        }
    });
    return response.data;
}

export const getUserBookingsProxy = async (targetUserId: number, requestUserId: number, correlationId: string, role: string) => {
    const response = await axios.get(`${BOOKING_SERVICE_URL}/user/${targetUserId}`, {
        headers: {
            'x-user-id': requestUserId.toString(),
            'x-user-role': role,
            'x-correlation-id': correlationId,
        }
    });
    return response.data;
}

export const cancelBookingProxy = async (id: number, userId: number, correlationId: string, role: string) => {
    const response = await axios.post(`${BOOKING_SERVICE_URL}/cancel/${id}`, {}, {
        headers: {
            'x-user-id': userId.toString(),
            'x-user-role': role,
            'x-correlation-id': correlationId,
        }
    });
    return response.data;
}
