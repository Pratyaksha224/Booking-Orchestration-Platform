export interface RegisterDTO {
    email: string;
    password?: string;
    firstName: string;
    lastName: string;
    phone?: string;
    role?: 'GUEST' | 'HOST' | 'ADMIN';
}

export interface LoginDTO {
    email: string;
    password?: string;
}

export interface UserResponseDTO {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    phone?: string;
    role: 'GUEST' | 'HOST' | 'ADMIN';
    createdAt: Date;
    updatedAt: Date;
}
