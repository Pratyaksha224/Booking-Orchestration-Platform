import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { LoginDTO, RegisterDTO, UserResponseDTO } from "../dto/user.dto";
import { createUser, findUserByEmail, findUserById } from "../repositories/user.repository";
import { ConflictError, NotFoundError, UnauthorizedError } from "../utils/errors/app.error";
import { serverConfig } from "../config";
import User from "../db/models/user";

const toUserResponseDTO = (user: User): UserResponseDTO => {
    return {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
    };
};

export const registerService = async (data: RegisterDTO): Promise<UserResponseDTO> => {
    const existingUser = await findUserByEmail(data.email);
    if (existingUser) {
        throw new ConflictError("Email already in use");
    }

    // Force strict cast for bcrypt salt
    const saltRounds: number = Number(serverConfig.BCRYPT_SALT_ROUNDS) || 10;
    const hashedPassword = await bcrypt.hash(data.password!, saltRounds);
    
    const user = await createUser({
        ...data,
        password: hashedPassword
    });

    return toUserResponseDTO(user);
};

export const loginService = async (data: LoginDTO): Promise<{ token: string, user: UserResponseDTO }> => {
    const user = await findUserByEmail(data.email);
    if (!user) {
        throw new UnauthorizedError("Invalid email or password");
    }

    const isMatch = await bcrypt.compare(data.password!, user.password);
    if (!isMatch) {
        throw new UnauthorizedError("Invalid email or password");
    }

    const payload = {
        userId: user.id,
        role: user.role
    };

    // Force strict cast for jwt secret
    const secret: string = String(serverConfig.JWT_SECRET);
    const token = jwt.sign(payload, secret, {
        expiresIn: (serverConfig.JWT_EXPIRY || "24h") as any
    });

    return {
        token,
        user: toUserResponseDTO(user)
    };
};

export const getProfileService = async (userId: number): Promise<UserResponseDTO> => {
    const user = await findUserById(userId);
    if (!user) {
        throw new NotFoundError("User not found");
    }

    return toUserResponseDTO(user);
};
