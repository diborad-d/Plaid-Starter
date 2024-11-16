const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();
const SECRET_KEY = process.env.JWT_SECRET_KEY; // Use environment variable for production
const users = []; // In-memory "database"

// Register user
router.post('/register', async (req, res) => {
  console.log('Register route hit');
  const { username, password } = req.body;

  // Check if user already exists
  const userExists = users.find((user) => user.username === username);
  if (userExists)
    return res.status(400).json({ message: 'User already exists' });

  try {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Save user to "database"
    users.push({ username, password: hashedPassword });
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error registering user:', error);
    // res.status(500).json({ message: 'Server error' });
    res.status(400).json({ message: error.message });
  }
});

// Login user
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  // Check if user exists
  const user = users.find((user) => user.username === username);
  if (!user) return res.status(400).json({ message: 'Invalid credentials' });

  // Compare password with stored hash
  try {
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: 'Invalid credentials' });

    // Generate JWT token
    const token = jwt.sign({ username: user.username }, SECRET_KEY, {
      expiresIn: '1h',
    });
    res.json({ token });
    console.log(`token: ${token}`)
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Protected route - Example of token verification
router.get('/protected', (req, res) => {
  const authHeader = req.headers['authorization'];

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res
      .status(403)
      .json({ message: 'No token provided or incorrect format' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    res.json({ message: 'Access granted', user: decoded });
  } catch (err) {
    console.error('Token verification error:', err);
    res.status(401).json({ message: 'Invalid token' });
  }
});

module.exports = router;
