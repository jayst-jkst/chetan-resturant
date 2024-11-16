import { DataTypes } from 'sequelize';
import { sequelize } from '../config/sequelize.js';

export const UserPostgresModel = sequelize.define(
  'User',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true, // Auto-incrementing ID
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false, // Required field
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true, // Ensure unique email
      validate: {
        isEmail: true, // Validate email format
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false, // Required field
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false, // Required field
    },
    isAdmin: {
      type: DataTypes.BOOLEAN,
      defaultValue: false, // Default to `false`
    },
    isBlocked: {
      type: DataTypes.BOOLEAN,
      defaultValue: false, // Default to `false`
    },
  },
  {
    timestamps: true, // Add createdAt and updatedAt columns
    tableName: 'users', // Optional: Specify the table name
    defaultScope: {
      attributes: { exclude: ['password'] }, // Exclude password by default in queries
    },
    scopes: {
      withPassword: { attributes: {} }, // Include password when explicitly requested
    },
  }
);
