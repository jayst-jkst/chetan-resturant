import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const databaseUrl = process.env.POSTGRES_URI;
if (!databaseUrl) {
    throw new Error('POSTGRES_URI is not defined or empty');
}

export const sequelize = new Sequelize(databaseUrl, {
  dialect: 'postgres',
  logging: false,
});