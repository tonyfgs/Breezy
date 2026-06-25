import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';
import { Role, ROLES } from '../../domain/entities/Role';

interface IUserAttributes {
    id: number;
    username: string;
    passwordHash: string;
    role: Role;
    createdAt: Date;
    updatedAt: Date;
}

type IUserCreationAttributes = Optional<IUserAttributes, 'id' | 'role' | 'createdAt' | 'updatedAt'>;

export class UserModel extends Model<IUserAttributes, IUserCreationAttributes> implements IUserAttributes {
    public id!: number;
    public username!: string;
    public passwordHash!: string;
    public role!: Role;
    public createdAt!: Date;
    public updatedAt!: Date;
}

UserModel.init(
    {
        id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
        username: { type: DataTypes.STRING, unique: true, allowNull: false },
        passwordHash: { type: DataTypes.STRING, allowNull: false },
        role: { type: DataTypes.ENUM(...ROLES), allowNull: false, defaultValue: 'user' },
        createdAt: { type: DataTypes.DATE },
        updatedAt: { type: DataTypes.DATE },
    },
    { sequelize, tableName: 'users', timestamps: true }
);

export default UserModel;
