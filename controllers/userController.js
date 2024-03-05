const { default: mongoose } = require('mongoose')
const User = require('../models/UserModel')
const validator = require('validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

//login user
const loginUser = async(req, res)=>{
    try {
        const { email, password } = req.body;
    
        // Check if email is valid
        if (!validator.isEmail(email)) {
          return res.status(400).json({ message: 'Invalid email address' });
        }
    
        // Find user by email
        const user = await User.findOne({ email: email });
        if (!user) {
          return res.status(400).json({ message: 'User not found' });
        }
    
        // Check if password is valid
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
          return res.status(400).json({ message: 'Invalid password' });
        }
    
        // Generate JWT token
        const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, {expiresIn: '3d'});
    
        res.status(200).json({ message: 'Login success', user: user, token: token });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
}

//signup user
const register = async(req, res)=>{
    try {
        const { name, email, password } = req.body;

        // Check if name is valid
        if (!validator.isAlpha(name.replace(/\s+/g, ''))) {
            return res.status(400).json({ message: 'Invalid name' });
        }

        // Check if email is valid
        if (!validator.isEmail(email)) {
            return res.status(400).json({ message: 'Invalid email address' });
        }
  
        // Check if password is valid
        if (!validator.isStrongPassword(password)) {
            return res.status(400).json({ message: 'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character' });
        }
    
        // Check if user already exists
        const existingUser = await User.findOne({ email: email });
        if (existingUser) {
          return res.status(400).json({ message: 'User already exists' });
        }
    
        // Create a new user
        const newUser = await User.register(name, email, password);

        // Generate JWT token
        const token = jwt.sign({ userId: newUser._id }, process.env.SECRET_KEY, {expiresIn: '3d'});

        res.status(201).json({ message: 'Sign-up success', user: newUser, token: token });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
}

//exports
module. exports ={
    loginUser,
    register
}
