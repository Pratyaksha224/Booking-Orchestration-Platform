import axios from 'axios';


const PROPERTY_SERVICE_URL = 'http://localhost:3002/api/v1/properties';

export const createPropertyProxy = async (data: any, userId: number, userRole: string) => {
    const response = await axios.post(PROPERTY_SERVICE_URL, data, {
        headers: {
            'x-user-id': userId.toString(),
            'x-user-role': userRole
        }
    });
    return response.data;
};

export const getPropertiesProxy = async () => {
    const response = await axios.get(PROPERTY_SERVICE_URL);
    return response.data;
};

export const getPropertyByIdProxy = async (id: number) => {
    const response = await axios.get(`${PROPERTY_SERVICE_URL}/${id}`);
    return response.data;
};
