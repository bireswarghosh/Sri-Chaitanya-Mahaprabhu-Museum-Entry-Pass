const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001', 'http://127.0.0.1:3000',"https://sri-chaitanya-mahaprabhu-museum-entry.onrender.com","https://sri-chaitanya-mahaprabhu-museum-ent.vercel.app", "https://your-backend-name.vercel.app"],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/roles', require('./routes/roles'));
app.use('/api/museum', require('./routes/museum'));

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'Museum API is running on port ' + PORT });
});

// For Vercel deployment
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Museum API Server running on port ${PORT}`);
  });
}

module.exports = app;




