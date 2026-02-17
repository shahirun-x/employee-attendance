const User = require('../models/User');
const Counter = require('../models/Counter');
const ApiError = require('../utils/ApiError');
const { generateToken } = require('../utils/helpers');

async function register(data) {
  try {
    let { email } = data;

    if (!email) {
      throw new ApiError(400, 'Email is required');
    }

    // check if email already taken
    let existing = await User.findOne({ email });
    if (existing) {
      throw new ApiError(409, 'Email is already registered');
    }

    // generate next employee ID using atomic counter
    let seq = await Counter.getNextSequence('employeeId');
    data.employeeId = 'EMP' + String(seq).padStart(4, '0');

    let user = await User.create(data);
    let token = generateToken(user._id);

    // Convert to plain object and remove password
    const userObj = user.toJSON();

    return { user: userObj, token };
  } catch (error) {
    // Handle MongoDB duplicate key errors
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      console.error(`Duplicate key error on field: ${field}`);
      throw new ApiError(409, `${field} already exists`);
    }

    // Handle Mongoose validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(e => e.message);
      console.error('Validation error:', messages);
      throw new ApiError(400, messages.join('. '));
    }

    // Re-throw custom ApiErrors
    if (error instanceof ApiError) {
      throw error;
    }

    // Log unexpected errors
    console.error('Unexpected error in register:', error);
    throw new ApiError(500, 'Registration failed. Please try again.');
  }
}

async function login({ email, password }) {
  try {
    if (!email || !password) {
      throw new ApiError(400, 'Email and password are required');
    }

    let user = await User.findOne({ email }).select('+password');
    if (!user) {
      console.warn(`Login attempt with non-existent email: ${email}`);
      throw new ApiError(401, 'Invalid email or password');
    }

    const isValidPassword = await user.comparePassword(password);
    if (!isValidPassword) {
      console.warn(`Failed login attempt for email: ${email}`);
      throw new ApiError(401, 'Invalid email or password');
    }

    let token = generateToken(user._id);
    const userObj = user.toJSON();

    return { user: userObj, token };
  } catch (error) {
    // Re-throw custom ApiErrors
    if (error instanceof ApiError) {
      throw error;
    }

    console.error('Unexpected error in login:', error);
    throw new ApiError(500, 'Login failed. Please try again.');
  }
}

async function getProfile(userId) {
  try {
    if (!userId) {
      throw new ApiError(400, 'User ID is required');
    }

    let user = await User.findById(userId);
    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    return user.toJSON();
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    console.error('Unexpected error in getProfile:', error);
    throw new ApiError(500, 'Failed to fetch profile. Please try again.');
  }
}

module.exports = { register, login, getProfile };
