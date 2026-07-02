import { CreationOptional, InferAttributes, InferCreationAttributes, Model } from "sequelize";
import sequelize from "./sequelize";

class Property extends Model<InferAttributes<Property>, InferCreationAttributes<Property>> {
    declare id: CreationOptional<number>;
    declare name: string;
    declare description: CreationOptional<string>;
    declare address: string;
    declare city: string;
    declare state: CreationOptional<string>;
    declare country: string;
    declare latitude: CreationOptional<number>;
    declare longitude: CreationOptional<number>;
    declare pricePerNight: number;
    declare maxGuests: number;
    declare amenities: CreationOptional<string[]>;
    declare images: CreationOptional<string[]>;
    declare hostId: number;
    declare rating: CreationOptional<number>;
    declare ratingCount: CreationOptional<number>;
    declare isActive: CreationOptional<boolean>;
    declare createdAt: CreationOptional<Date>;
    declare updatedAt: CreationOptional<Date>;
    declare deletedAt: CreationOptional<Date | null>;
}

Property.init({
    id: {
        type: "INTEGER",
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: "STRING",
        allowNull: false
    },
    description: {
        type: "TEXT"
    },
    address: {
        type: "STRING",
        allowNull: false
    },
    city: {
        type: "STRING",
        allowNull: false
    },
    state: {
        type: "STRING"
    },
    country: {
        type: "STRING",
        allowNull: false
    },
    latitude: {
        type: "DECIMAL(10,8)"
    },
    longitude: {
        type: "DECIMAL(11,8)"
    },
    pricePerNight: {
        type: "DECIMAL(10,2)",
        allowNull: false
    },
    maxGuests: {
        type: "INTEGER",
        allowNull: false,
        defaultValue: 1
    },
    amenities: {
        type: "JSON"
    },
    images: {
        type: "JSON"
    },
    hostId: {
        type: "INTEGER",
        allowNull: false
    },
    rating: {
        type: "DECIMAL(3,2)",
        defaultValue: null
    },
    ratingCount: {
        type: "INTEGER",
        defaultValue: 0
    },
    isActive: {
        type: "BOOLEAN",
        defaultValue: true
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
    tableName: "properties",
    sequelize: sequelize,
    underscored: true,
    timestamps: true
});

export default Property;
