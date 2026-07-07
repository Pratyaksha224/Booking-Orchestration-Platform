import axios from 'axios';
import { getCorrelationId } from '../utils/helpers/request.helpers';
import { NotFoundError, InternalServerError } from '../utils/errors/app.error';

const PROPERTY_SERVICE_URL = 'http://localhost:3002/api/v1/properties';

export const getPropertyDetails = async (propertyId: number) => {
    try {
        const correlationId = getCorrelationId();
        const response = await axios.get(`${PROPERTY_SERVICE_URL}/${propertyId}`, {
            headers: {
                'x-correlation-id': correlationId,
            }
        });
        
        return response.data.data;
    } catch (error: any) {
        if (error.response?.status === 404) {
            throw new NotFoundError("Property not found");
        }
        throw new InternalServerError("Error fetching property details");
    }
}
