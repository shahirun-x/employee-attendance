const authService = require('../services/authService');
const { sendSuccess, sendCreated } = require('../utils/ApiResponse');

exports.register = async function(req, res, next) {
  try {
    console.log('Register attempt:', { email: req.body.email, name: req.body.name });
    let result = await authService.register(req.body);
    console.log('Registration successful:', { email: req.body.email, employeeId: result.user.employeeId });
    return sendCreated(res, result, 'Registration successful');
  } catch (err) {
    console.error('Register error:', err.message);
    next(err);
  }
};

exports.login = async function(req, res, next) {
  try {
    console.log('Login attempt:', { email: req.body.email });
    let result = await authService.login(req.body);
    console.log('Login successful:', { email: req.body.email, employeeId: result.user.employeeId });
    return sendSuccess(res, result, 'Login successful');
  } catch (err) {
    console.error('Login error:', err.message);
    next(err);
  }
};

exports.getProfile = async function(req, res, next) {
  try {
    let user = await authService.getProfile(req.user._id);
    return sendSuccess(res, user);
  } catch (err) {
    console.error('Get profile error:', err.message);
    next(err);
  }
};
