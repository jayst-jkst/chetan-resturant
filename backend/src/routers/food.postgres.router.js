import { Router } from 'express';
import { FoodPostgressModel } from '../models/food.postgres.model.js';
import handler from 'express-async-handler';
import admin from '../middleware/admin.mid.js';
import { Op } from 'sequelize';

const router = Router();

// Get all foods
router.get(
  '/',
  handler(async (req, res) => {
    const foods = await FoodPostgressModel.findAll();
    res.send(foods);
  })
);

// Create a new food item
router.post(
  '/',
  admin,
  handler(async (req, res) => {
    const { name, price, tags, favorite, imageUrl, origins, cookTime } = req.body;

    const food = await FoodPostgressModel.create({
      name,
      price,
      tags: tags.split ? tags.split(',') : tags,
      favorite,
      imageUrl,
      origins: origins.split ? origins.split(',') : origins,
      cookTime,
    });

    res.send(food);
  })
);

// Update a food item
router.put(
  '/',
  admin,
  handler(async (req, res) => {
    const { id, name, price, tags, favorite, imageUrl, origins, cookTime } = req.body;

    await FoodPostgressModel.update(
      {
        name,
        price,
        tags: tags.split ? tags.split(',') : tags,
        favorite,
        imageUrl,
        origins: origins.split ? origins.split(',') : origins,
        cookTime,
      },
      { where: { id } }
    );

    res.send();
  })
);

// Delete a food item
router.delete(
  '/:foodId',
  admin,
  handler(async (req, res) => {
    const { foodId } = req.params;

    await FoodPostgressModel.destroy({ where: { id: foodId } });
    res.send();
  })
);

// Get tags with their counts
router.get(
  '/tags',
  handler(async (req, res) => {
    const tagsData = await FoodPostgressModel.findAll({
      attributes: ['tags'],
    });

    const tagCounts = {};
    tagsData.forEach(({ tags }) => {
      tags.forEach(tag => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });
    });

    const tags = Object.entries(tagCounts).map(([name, count]) => ({
      name,
      count,
    }));

    const allCount = await FoodPostgressModel.count();
    tags.unshift({ name: 'All', count: allCount });

    res.send(tags);
  })
);

// Search for food items by name
router.get(
  '/search/:searchTerm',
  handler(async (req, res) => {
    const { searchTerm } = req.params;

    const foods = await FoodPostgressModel.findAll({
      where: {
        name: { [Op.iLike]: `%${searchTerm}%` },
      },
    });

    res.send(foods);
  })
);

// Get foods by tag
router.get(
  '/tag/:tag',
  handler(async (req, res) => {
    const { tag } = req.params;

    const foods = await FoodPostgressModel.findAll({
      where: {
        tags: { [Op.contains]: [tag] }, // For PostgreSQL array columns
      },
    });

    res.send(foods);
  })
);

// Get a single food item by ID
router.get(
  '/:foodId',
  handler(async (req, res) => {
    const { foodId } = req.params;

    const food = await FoodPostgressModel.findByPk(foodId);
    res.send(food);
  })
);

export default router;
