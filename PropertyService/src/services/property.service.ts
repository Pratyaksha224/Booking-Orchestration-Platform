import { CreatePropertyDTO } from "../dto/property.dto";
import { createProperty, getProperties, getPropertyById } from "../repositories/property.repository";
import { NotFoundError } from "../utils/errors/app.error";

export const createPropertyService = async (data: CreatePropertyDTO) => {
    return await createProperty(data);
};

export const getPropertiesService = async () => {
    return await getProperties();
};

export const getPropertyByIdService = async (id: number) => {
    const property = await getPropertyById(id);
    if (!property) {
        throw new NotFoundError("Property not found");
    }
    return property;
};
