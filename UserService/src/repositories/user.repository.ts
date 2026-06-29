import User from "../db/models/user";
import { RegisterDTO } from "../dto/user.dto";

export const createUser = async (data: RegisterDTO) => {
    return await User.create({
        email: data.email,
        password: data.password!,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        role: data.role
    });
};

export const findUserByEmail = async (email: string) => {
    return await User.findOne({
        where: { email, deletedAt: null }
    });
};

export const findUserById = async (id: number) => {
    return await User.findOne({
        where: { id, deletedAt: null }
    });
};
