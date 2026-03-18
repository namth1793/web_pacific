const db = require('../db');
const bcrypt = require('bcryptjs');

const formatUser = (user) => {
  if (!user) return null;
  const { password, is_active, ...rest } = user;
  return { ...rest, isActive: Boolean(is_active) };
};

// GET /api/users (admin only)
const getAll = (req, res) => {
  try {
    const { role, page = 1, limit = 20, search } = req.query;

    const conditions = [];
    const params = [];

    if (role) {
      conditions.push('role = ?');
      params.push(role);
    }

    if (search) {
      conditions.push('(name LIKE ? OR email LIKE ?)');
      params.push(`%${search}%`, `%${search}%`);
    }

    const where = conditions.length > 0 ? 'WHERE ' + conditions.join(' AND ') : '';
    const offset = (parseInt(page) - 1) * parseInt(limit);

    const users = db.prepare(`
      SELECT id, name, email, role, locale, avatar, is_active, created_at, updated_at
      FROM users ${where}
      ORDER BY created_at DESC
      LIMIT ? OFFSET ?
    `).all(...params, parseInt(limit), offset);

    const totalRow = db.prepare(`SELECT COUNT(*) as cnt FROM users ${where}`).get(...params);
    const total = totalRow ? totalRow.cnt : 0;

    res.json({
      success: true,
      data: users.map(formatUser),
      pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / parseInt(limit)) },
    });
  } catch (err) {
    console.error('getAll users error:', err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// GET /api/users/:id (admin only)
const getOne = (req, res) => {
  try {
    const user = db.prepare('SELECT id, name, email, role, locale, avatar, is_active, created_at, updated_at FROM users WHERE id = ?').get(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });
    res.json({ success: true, data: formatUser(user) });
  } catch (err) {
    console.error('getOne user error:', err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// PUT /api/users/:id (admin only)
const update = (req, res) => {
  try {
    const { name, role, isActive, locale } = req.body;
    const updates = [];
    const params = [];

    if (name) { updates.push('name = ?'); params.push(name); }
    if (role) { updates.push('role = ?'); params.push(role); }
    if (isActive !== undefined) { updates.push('is_active = ?'); params.push(isActive ? 1 : 0); }
    if (locale) { updates.push('locale = ?'); params.push(locale); }

    if (updates.length === 0) {
      return res.status(400).json({ success: false, message: 'No fields to update.' });
    }

    updates.push("updated_at = datetime('now')");
    params.push(req.params.id);

    const result = db.prepare(`UPDATE users SET ${updates.join(', ')} WHERE id = ?`).run(...params);
    if (result.changes === 0) return res.status(404).json({ success: false, message: 'User not found.' });

    const user = db.prepare('SELECT id, name, email, role, locale, avatar, is_active, created_at, updated_at FROM users WHERE id = ?').get(req.params.id);
    res.json({ success: true, message: 'User updated.', data: formatUser(user) });
  } catch (err) {
    console.error('update user error:', err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// DELETE /api/users/:id (admin only)
const remove = (req, res) => {
  try {
    if (String(req.params.id) === String(req.user.id)) {
      return res.status(400).json({ success: false, message: 'Cannot delete your own account.' });
    }
    const result = db.prepare('DELETE FROM users WHERE id = ?').run(req.params.id);
    if (result.changes === 0) return res.status(404).json({ success: false, message: 'User not found.' });
    res.json({ success: true, message: 'User deleted.' });
  } catch (err) {
    console.error('delete user error:', err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// POST /api/users/create-staff (admin only - create moderator/admin users)
const createStaff = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Name, email, and password are required.' });
    }

    const allowedRoles = ['admin', 'moderator'];
    const userRole = allowedRoles.includes(role) ? role : 'moderator';

    const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email.toLowerCase());
    if (existing) return res.status(409).json({ success: false, message: 'Email already registered.' });

    const hashedPassword = await bcrypt.hash(password, 12);
    const result = db.prepare(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)'
    ).run(name, email.toLowerCase(), hashedPassword, userRole);

    const user = db.prepare('SELECT id, name, email, role, locale, avatar, is_active, created_at, updated_at FROM users WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json({ success: true, message: 'Staff user created.', data: formatUser(user) });
  } catch (err) {
    console.error('createStaff error:', err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

module.exports = { getAll, getOne, update, remove, createStaff };
