import { FoodPostgressModel } from '../models/food_postgress.model.js';

export const getAllFoods = async () => {
  return await FoodPostgressModel.findAll();
};

export const getFoodById = async (id) => {
  return await FoodPostgressModel.findByPk(id);
};

export const createFood = async (foodData) => {
  return await FoodPostgressModel.create(foodData);
};

export const updateFood = async (id, foodData) => {
  const food = await getFoodById(id);
  if (!food) throw new Error('Food not found');
  return await food.update(foodData);
};

export const deleteFood = async (id) => {
  const food = await getFoodById(id);
  if (!food) throw new Error('Food not found');
  return await food.destroy();
};