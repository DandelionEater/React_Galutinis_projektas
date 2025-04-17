// authRoutes.ts
import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User';

const router = express.Router();

// Registracijos maršrutas
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  console.log("request posted")

  // Patikriname, ar vartotojas jau egzistuoja
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: 'User already exists' });
  }

  // Užšifruojame slaptažodį
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = new User({
    username,
    email,
    password: hashedPassword,
    animeList: []
  });

  try {
    await user.save();

    // Sukuriam tokeną po registracijos
    const token = jwt.sign({ id: user._id }, Buffer.from(process.env.JWT_SECRET ?? "secret"), { expiresIn: '10h' });

    // Grąžinam tokeną ir naudotojo duomenis (be slaptažodžio!)
    res.status(201).json({
      message: 'User created successfully',
      token,
      user: {
        id: user._id,
        username: user.username,
        avatarUrl: user.avatarUrl, // jei tokį turi
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Prisijungimo maršrutas
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
  
    // Patikrinti, ar vartotojas egzistuoja pagal 'username'
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
  
    // Patikrinti slaptažodį
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
  
    // Sukuriame JWT tokeną
    const token = jwt.sign({ id: user._id }, Buffer.from(process.env.JWT_SECRET ?? "secret"), { expiresIn: '1h' });
  
    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        avatarUrl: user.avatarUrl, // jei turi
      }
    });
  });

export default router;
