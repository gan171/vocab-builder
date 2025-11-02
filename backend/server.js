// server.js
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// === NEW: Import our 'auth' guard ===
const auth = require('./middleware/auth');

// 2. Setup App (Unchanged)
const app = express();
const PORT = 4000;
app.use(cors());
app.use(express.json());

// 3. JWT Secret (Unchanged)
const JWT_SECRET = process.env.JWT_SECRET; // (Use your .env variable)

// 4. User Schema & Model (Unchanged)
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});
const User = mongoose.model('User', userSchema);

// 5. === UPDATED: Word Schema ===
const wordSchema = new mongoose.Schema({
  // We remove the old 'id' field
  word: String,
  meaning: String,
  sentence: String,
  
  // === NEW: The 'owner' field ===
  // This links every word to a specific user's ID
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },

  // SRS fields (Unchanged)
  reviewCount: { type: Number, default: 0 },
  lastReviewed: { type: Date, default: null },
  nextReviewDate: { type: Date, default: Date.now }, 
  difficulty: { type: String, default: 'new' } 
});

const Word = mongoose.model('Word', wordSchema);

// === NEW: Define our Official "Starter" Deck ===
const OFFICIAL_STARTER_DECK = [
  { word: 'Persecute', meaning: 'To harass or treat cruelly...', sentence: 'The regime...' },
  { word: 'Benevolent', meaning: 'Well meaning and kindly...', sentence: 'A benevolent smile...' },
  { word: 'Ostracize', meaning: 'To exclude someone...', sentence: 'He was ostracized...' },
  { word: 'Ephemeral', meaning: 'Lasting for a very short time...', sentence: 'The beauty...' }
];


// ===================================
// 6. === UPDATED: AUTH API ENDPOINTS ===
// ===================================

// POST /api/auth/register
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({ email, password: hashedPassword });
    await newUser.save();

    // === NEW: Create a personal copy of the starter deck for the new user ===
    const userStarterDeck = OFFICIAL_STARTER_DECK.map(word => ({
      ...word,
      owner: newUser._id, // Assign this new user as the owner
      nextReviewDate: new Date() // Set review date
    }));

    // Insert these new words into the 'words' collection
    await Word.insertMany(userStarterDeck);

    res.status(201).json({ message: 'User created successfully!' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/auth/login (Unchanged)
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign(
      { id: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: '3h' }
    );
    res.json({ token, user: { id: user._id, email: user.email } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});


// ===================================
// 7. === UPDATED: WORD API ENDPOINTS ===
// ===================================

// GET /api/decks
// 1. We add 'auth' as our middleware. This runs *before* the 'async (req, res)' part.
// 2. 'auth' will add 'req.user.id' for us to use.
app.get('/api/decks', auth, async (req, res) => {
  console.log(`Request received for /api/decks from user ${req.user.id}`);
  try {
    // 3. We find *only* the words that belong to the logged-in user
    const words = await Word.find({ owner: req.user.id }); 
    res.json(words);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/decks/difficult
// We also protect this route with 'auth'
app.get('/api/decks/difficult', auth, async (req, res) => {
  console.log(`Request for /api/decks/difficult from user ${req.user.id}`);
  try {
    // We find *only* the 'hard' words that belong to this user
    const difficultWords = await Word.find({ 
      owner: req.user.id, 
      difficulty: 'hard' 
    });
    res.json(difficultWords);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/review
// We also protect this route with 'auth'
app.post('/api/review', auth, async (req, res) => {
  const { id, rating } = req.body; 
  console.log(`[SERVER] Review for word ${id} from user ${req.user.id}`);
  
  try {
    let newDifficulty = 'good';
    if (rating === 'again' || rating === 'hard') {
      newDifficulty = 'hard';
    }

    // We add 'owner: req.user.id' to the query.
    // This makes it IMPOSSIBLE for one user to accidentally
    // update another user's word.
    const updatedWord = await Word.findOneAndUpdate(
      { _id: id, owner: req.user.id }, // Find *my* word
      { 
        difficulty: newDifficulty,
        lastReviewed: new Date(),
        $inc: { reviewCount: 1 }
      },
      { new: true } 
    );
    
    if (!updatedWord) {
      return res.status(404).json({ message: 'Word not found or user not authorized' });
    }

    res.json({ 
      status: 'success', 
      message: `Updated ${updatedWord.word}`,
      data: updatedWord 
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error updating word' });
  }
});


// 8. Start Server & Connect to DB
async function startServer() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Successfully connected to MongoDB Atlas!");

    // We no longer need the 'seedDatabase' function
    // because we seed the deck on a *per-user* basis
    // during registration.
    
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("Could not connect to database:", err);
    process.exit(1);
  }
}

startServer();