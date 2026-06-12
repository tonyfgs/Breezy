import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface IUserAttributes {
    id: number;
    username: string;
    passwordHash: string;
    role: string;
    createdAt: Date;
    updatedAt: Date;
}

type IUserCreationAttributes = Optional<IUserAttributes, 'id' | 'role' | 'createdAt' | 'updatedAt'>;

export class UserModel extends Model<IUserAttributes, IUserCreationAttributes> implements IUserAttributes {
    public id!: number;
    public username!: string;
    public passwordHash!: string;
    public role!: string;
    public createdAt!: Date;
    public updatedAt!: Date;
}

UserModel.init(
    {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        username: { type: DataTypes.STRING, unique: true, allowNull: false },
        passwordHash: { type: DataTypes.STRING, allowNull: false },
        role: { type: DataTypes.STRING, allowNull: false, defaultValue: 'user' },
        createdAt: { type: DataTypes.DATE },
        updatedAt: { type: DataTypes.DATE },
    },
    { sequelize, tableName: 'users', timestamps: true }
);

export default UserModel;
