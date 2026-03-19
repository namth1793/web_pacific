require('dotenv').config();
const db = require('./src/db'); // init SQLite — creates tables if not exist

// Auto-seed on first run (when DB is empty)
function autoSeed() {
  try {
    const count = db.prepare('SELECT COUNT(*) as n FROM users').get();
    if (count.n === 0) {
      console.log('🌱 Empty database detected — running auto-seed...');
      require('./seed/auto');
      console.log('✅ Auto-seed complete.');
    }
  } catch (e) {
    console.error('Auto-seed error:', e.message);
  }
}
autoSeed();

const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

// CORS
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(cors({
  origin: (origin, cb) => {
    if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
    // Also allow any vercel.app subdomain
    if (origin.endsWith('.vercel.app')) return cb(null, true);
    cb(new Error('Not allowed by CORS'));
  },
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
