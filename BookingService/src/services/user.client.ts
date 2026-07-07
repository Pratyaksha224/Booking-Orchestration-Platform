import axios from 'axios';
import { getCorrelationId } from '../utils/helpers/request.helpers';
import { NotFoundError, InternalServerError } from '../utils/errors/app.error';

const USER_SERVICE_URL = 'http://localhost:3000/api/v1/auth/users';

export const getUserDetails = async (userId: number) => {
    try {
        const correlationId = getCorrelationId();
        const response = await axios.get(`${USER_SERVICE_URL}/${userId}`, {
            headers: {
                'x-correlation-id': correlationId,
            }
        });
        
        return response.data.data;
    } catch (error: any) {
        if (error.response?.status === 404) {
            throw new NotFoundError("User not found");
        }
        throw new InternalServerError("Error fetching user details");
    }
}
