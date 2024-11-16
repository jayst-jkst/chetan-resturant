import { Router } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { BAD_REQUEST } from '../constants/httpStatus.js';
import handler from 'express-async-handler';
import { UserPostgresModel } from '../models/user.postgres.model.js';
import auth from '../middleware/auth.mid.js';
import admin from '../middleware/admin.mid.js';

const router = Router();
const PASSWORD_HASH_SALT_ROUNDS = 10;

// Login endpoint
router.post(
  '/login',
  handler(async (req, res) => {
    const { email, password } = req.body;
    //console.log("email password: ", email);
    const user = await UserPostgresModel.scope('withPassword').findOne({ where: { email } });
    //console.log("password passed: ", password); // Check the value of 'password'
    //console.log("user is: ", user);
    //console.log("user password: ", user.password); // Check if 'user.password' is valid

    if (user && (await bcrypt.compare(password, user.password))) {
      res.send(generateTokenResponse(user));
      return;
    }

    res.status(BAD_REQUEST).send('Username or password is invalid');
  })
);

// Register endpoint
router.post(
  '/register',
  handler(async (req, res) => {
    const { name, email, password, address } = req.body;

    const existingUser = await UserPostgresModel.findOne({ where: { email } });

    if (existingUser) {
      res.status(BAD_REQUEST).send('User already exists, please login!');
      return;
    }

    const hashedPassword = await bcrypt.hash(password, PASSWORD_HASH_SALT_ROUNDS);

    const newUser = await UserPostgresModel.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      address,
    });

    res.send(generateTokenResponse(newUser));
  })
);

// Update profile
router.put(
  '/updateProfile',
  auth,
  handler(async (req, res) => {
    const { name, address } = req.body;

    const user = await UserPostgresModel.update(
      { name, address },
      { where: { id: req.user.id }, returning: true }
    );

    res.send(generateTokenResponse(user[1][0]));
  })
);

// Change password
router.put(
  '/changePassword',
  auth,
  handler(async (req, res) => {
    const { currentPassword, newPassword } = req.body;

    const user = await UserPostgresModel.findByPk(req.user.id);

    if (!user) {
      res.status(BAD_REQUEST).send('Change Password Failed!');
      return;
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);

    if (!isMatch) {
      res.status(BAD_REQUEST).send('Current Password Is Not Correct!');
      return;
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, PASSWORD_HASH_SALT_ROUNDS);
    user.password = hashedNewPassword;
    await user.save();

    res.send();
  })
);

// Get all users with optional search
router.get(
  '/getall/:searchTerm?',
  admin,
  handler(async (req, res) => {
    const { searchTerm } = req.params;

    const whereClause = searchTerm
      ? { name: { [Op.iLike]: `%${searchTerm}%` } }
      : {};

    const users = await UserPostgresModel.findAll({
      where: whereClause,
      attributes: { exclude: ['password'] },
    });

    res.send(users);
  })
);

// Toggle block user
router.put(
  '/toggleBlock/:userId',
  admin,
  handler(async (req, res) => {
    const { userId } = req.params;

    if (parseInt(userId) === req.user.id) {
      res.status(BAD_REQUEST).send("Can't block yourself!");
      return;
    }

    const user = await UserPostgresModel.findByPk(userId);

    if (!user) {
      res.status(BAD_REQUEST).send('User not found!');
      return;
    }

    user.isBlocked = !user.isBlocked;
    await user.save();

    res.send(user.isBlocked);
  })
);

// Get user by ID
router.get(
  '/getById/:userId',
  admin,
  handler(async (req, res) => {
    const { userId } = req.params;

    const user = await UserPostgresModel.findByPk(userId, {
      attributes: { exclude: ['password'] },
    });

    if (!user) {
      res.status(BAD_REQUEST).send('User not found!');
      return;
    }

    res.send(user);
  })
);

// Admin update user
router.put(
  '/update',
  admin,
  handler(async (req, res) => {
    const { id, name, email, address, isAdmin } = req.body;

    await UserPostgresModel.update(
      { name, email, address, isAdmin },
      { where: { id } }
    );

    res.send();
  })
);

// Generate token response
const generateTokenResponse = (user) => {
  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
      isAdmin: user.isAdmin,
    },
    process.env.JWT_SECRET,
    { expiresIn: '30d' }
  );

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    address: user.address,
    isAdmin: user.isAdmin,
    token,
  };
};

export default router;
