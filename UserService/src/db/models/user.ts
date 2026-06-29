import { CreationOptional, InferAttributes, InferCreationAttributes, Model } from "sequelize";
import sequelize from "./sequelize";

class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
    declare id: CreationOptional<number>;
    declare email: string;
    declare password: string;
    declare firstName: string;
    declare lastName: string;
    declare phone: CreationOptional<string>;
    declare role: CreationOptional<'GUEST' | 'HOST' | 'ADMIN'>;
    declare createdAt: CreationOptional<Date>;
    declare updatedAt: CreationOptional<Date>;
    declare deletedAt: CreationOptional<Date | null>;
}

User.init({
    id: {
        type: "INTEGER",
        primaryKey: true,
        autoIncrement: true
    },
    email: {
        type: "STRING",
        allowNull: false,
        unique: true
    },
    password: {
        type: "STRING",
        allowNull: false
    },
    firstName: {
        type: "STRING",
        allowNull: false
    },
    lastName: {
        type: "STRING",
        allowNull: false
    },
    phone: {
        type: "STRING",
        allowNull: true
    },
    role: {
        type: "ENUM('GUEST', 'HOST', 'ADMIN')",
        defaultValue: 'GUEST'
    },
    createdAt: {
        type: "DATE",
        defaultValue: new Date()
    },
    updatedAt: {
        type: "DATE",
        defaultValue: new Date()
    },
    deletedAt: {
        type: "DATE",
        defaultValue: null
    }
}, {
    tableName: "users",
    sequelize: sequelize,
    underscored: true,
    timestamps: true
});

export default User;
