const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // ✅ ADD THIS  
require('dotenv').config();

const Language = require('./models/language');

const app = express();

// ✅ Enable CORS for all origins (allow frontend to access backend)
app.use(cors());

app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.log(err));

// GET all languages
app.get('/languages', async (req, res) => {
  const languages = await Language.find();
  res.json(languages);
});

// POST a new language
app.post('/languages', async (req, res) => {
  try {
    const language = new Language(req.body);
    await language.save();
    res.status(201).json(language);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get by ID
app.get('/languages/:id', async (req, res) => {
  try {
    const language = await Language.findById(req.params.id);
    if (!language) return res.status(404).json({ message: 'Not found' });
    res.json(language);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update
app.put('/languages/:id', async (req, res) => {
  try {
    const updated = await Language.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: 'Not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete
app.delete('/languages/:id', async (req, res) => {
  try {
    const deleted = await Language.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Language deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(3000, () => console.log('Server running on http://localhost:3000'));
