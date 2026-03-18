require('dotenv').config();
require('./src/db'); // init SQLite — creates tables if not exist
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

// CORS
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true,
}));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve static uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', require('./src/routes/auth'));
app.use('/api/articles', require('./src/routes/articles'));
app.use('/api/programs', require('./src/routes/programs'));
app.use('/api/research', require('./src/routes/research'));
app.use('/api/tests', require('./src/routes/tests'));
app.use('/api/users', require('./src/routes/users'));
app.use('/api/comments', require('./src/routes/comments'));
app.use('/api/contact', require('./src/routes/contact'));
app.use('/api/upload', require('./src/routes/upload'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Web Pacific API is running', timestamp: new Date() });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

const PORT = process.env.PORT || 5010;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

module.exports = app;
