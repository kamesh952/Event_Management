import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import db from '../models/index.js';
const User = db.User;

// Helper function for consistent error responses
const errorResponse = (res, statusCode, message) => {
  return res.status(statusCode).json({ 
    success: false, 
    error: message 
  });
};

// User Registration
export const registerUser = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  // Validate JWT secret
  if (!process.env.JWT_SECRET) {
    console.error('JWT_SECRET missing in environment');
    return errorResponse(res, 500, 'Server configuration error');
  }

  // Input validation
  if (!firstName || !lastName || !email || !password) {
    return errorResponse(res, 400, 'All fields are required');
  }

  try {
    // Check for existing user
    const existingUser = await User.findOne({ 
      where: { email: email.toLowerCase() } 
    });
    
    if (existingUser) {
      return errorResponse(res, 400, 'Email already in use');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create user
    const newUser = await User.create({
      firstName,
      lastName,
      email: email.toLowerCase(),
      password: hashedPassword
    });

    // Generate JWT token
    const token = jwt.sign(
      { id: newUser.id, email: newUser.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Successful response
    res.status(201).json({
      success: true,
      message: 'Registration successful',
      token,
      user: {
        id: newUser.id,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    errorResponse(res, 500, 'Registration failed');
  }
};

// User Login
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  // Validate JWT secret
  if (!process.env.JWT_SECRET) {
    console.error('JWT_SECRET missing in environment');
    return errorResponse(res, 500, 'Server configuration error');
  }

  // Input validation
  if (!email || !password) {
    return errorResponse(res, 400, 'Email and password are required');
  }

  try {
    // Find user
    const user = await User.findOne({ 
      where: { email: email.toLowerCase() } 
    });

    if (!user) {
      return errorResponse(res, 401, 'Invalid credentials');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return errorResponse(res, 401, 'Invalid credentials');
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Successful response
    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    errorResponse(res, 500, 'Login failed');
  }
};

// Get User Profile
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ['id', 'firstName', 'lastName', 'email']
    });

    if (!user) {
      return errorResponse(res, 404, 'User not found');
    }

    res.status(200).json({
      success: true,
      user
    });

  } catch (error) {
    console.error('Profile error:', error);
    errorResponse(res, 500, 'Error fetching profile');
  }
};