import { DataTypes } from 'sequelize';
import { sequelize } from '../config/sequelize.js'; // Assuming you have Sequelize initialized
import { FoodPostgressModel } from './food.postgres.model.js'; // Import Food model
import { UserPostgresModel } from './user.postgres.model.js'; // Import User model

// LatLng Model (stored as a composite type in PostgreSQL)
const LatLng = sequelize.define('LatLng', {
  lat: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  lng: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  freezeTableName: true,
  timestamps: false,
  underscored: true,
});

// OrderItem Model
const OrderItem = sequelize.define('OrderItem', {
  price: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  freezeTableName: true,
  timestamps: false,
  underscored: true,
});

// Define the relationship between OrderItem and Food
OrderItem.belongsTo(FoodPostgressModel, {
  foreignKey: 'foodId',
  as: 'food',
});

// Order Model
const Order = sequelize.define('Order', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  address: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  totalPrice: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  paymentId: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'NEW', // Assuming OrderStatus.NEW corresponds to 'NEW' in PostgreSQL
  },
}, {
  freezeTableName: true,
  timestamps: true, // Sequelize will automatically add createdAt and updatedAt
  underscored: true,
});

// Define relationships for Order Model
Order.belongsTo(UserPostgresModel, { foreignKey: 'userId' });
Order.hasMany(OrderItem, { foreignKey: 'orderId' });
Order.belongsTo(LatLng, { foreignKey: 'addressLatLngId' });

// Sync models (this step will create the tables in PostgreSQL if they don't exist)
sequelize.sync({ force: false }).then(() => {
  console.log('Tables have been synchronized');
});

export { Order, OrderItem, LatLng };
