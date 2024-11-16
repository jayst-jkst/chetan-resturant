import { Sequelize } from 'sequelize';
import { sequelize } from '../config/sequelize.js';
import { FoodPostgressModel } from '../models/food.postgres.model.js';
import { UserPostgresModel } from '../models/user.postgres.model.js';
import { sample_users, sample_foods } from '../data.js';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

const PASSWORD_HASH_SALT_ROUNDS = 10
export const dbconnectpostgress = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection to PostgreSQL has been established successfully.');
    
    await sequelize.sync({ force: false});
    await seedUsers();
    await seedFoods();
    
    console.log('Connected to PostgreSQL and synced models successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

async function seedUsers() {
  const usersCount = await UserPostgresModel.count();
  if (usersCount > 0) {
    console.log('Users seed is already done!');
    return;
  }

  for (let user of sample_users) {
    user.password = await bcrypt.hash(user.password, PASSWORD_HASH_SALT_ROUNDS);
    await UserPostgresModel.create(user);
  }

  console.log('Users seed is done!');
}

async function seedFoods() {
  const foodsCount = await FoodPostgressModel.count();
  if (foodsCount > 0) {
    console.log('Foods seed is already done!+'+foodsCount);
    return;
  }

  for (let food of sample_foods) {
    food.imageUrl = `/foods/${food.imageUrl}`;
    await FoodPostgressModel.create(food);
  }

  console.log('Foods seed is done!');
}
