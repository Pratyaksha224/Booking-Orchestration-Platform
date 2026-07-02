import Property from "../db/models/property";
import { CreatePropertyDTO } from "../dto/property.dto";

export const createProperty = async (data: CreatePropertyDTO) => {
    return await Property.create(data as any);
};

export const getProperties = async () => {
    return await Property.findAll({ where: { deletedAt: null } });
};

export const getPropertyById = async (id: number) => {
    return await Property.findOne({ where: { id, deletedAt: null } });
};
