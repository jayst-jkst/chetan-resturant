import { DataTypes } from 'sequelize';
import { sequelize } from '../config/sequelize.js';

export const FoodPostgressModel = sequelize.define('Food', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true, 
    primaryKey: true,
    unique: true, 
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  tags: {
    type: DataTypes.ARRAY(DataTypes.STRING),
  },
  favorite: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  stars: {
    type: DataTypes.FLOAT,
    defaultValue: 3,
  },
  imageUrl: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  origins: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: false,
  },
  cookTime: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  timestamps: true,
});
