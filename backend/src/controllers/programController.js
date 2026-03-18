const db = require('../db');

const formatProgram = (row, locale) => {
  if (!row) return null;
  const translations = JSON.parse(row.translations || '{}');
  const trans = translations[locale] || translations['vi'] || {};
  return {
    id: row.id,
    slug: row.slug,
    type: row.type,
    duration: row.duration,
    level: row.level,
    featured_image: row.featured_image,
    status: row.status,
    sort_order: row.sort_order,
    translations,
    translation: trans,
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
};

// GET /api/programs
const getAll = (req, res) => {
  try {
    const { type, status, locale = 'vi', page = 1, limit = 20 } = req.query;
    const isAdmin = req.user && req.user.role === 'admin';

    const conditions = [];
    const params = [];

    if (!isAdmin) {
      conditions.push('status = ?');
      params.push('published');
    } else if (status) {
      conditions.push('status = ?');
      params.push(status);
    }

    if (type) {
      conditions.push('type = ?');
      params.push(type);
    }

    const where = conditions.length > 0 ? 'WHERE ' + conditions.join(' AND ') : '';
    const offset = (parseInt(page) - 1) * parseInt(limit);

    const rows = db.prepare(`
      SELECT * FROM programs ${where}
      ORDER BY sort_order ASC, created_at ASC
      LIMIT ? OFFSET ?
    `).all(...params, parseInt(limit), offset);

    const totalRow = db.prepare(`SELECT COUNT(*) as cnt FROM programs ${where}`).get(...params);
    const total = totalRow ? totalRow.cnt : 0;

    const result = rows.map((row) => formatProgram(row, locale));

    res.json({
      success: true,
      data: result,
      pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / parseInt(limit)) },
    });
  } catch (err) {
    console.error('getAll programs error:', err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// GET /api/programs/:slug
const getOne = (req, res) => {
  try {
    const { locale = 'vi' } = req.query;
    const row = db.prepare('SELECT * FROM programs WHERE slug = ?').get(req.params.slug);

    if (!row) return res.status(404).json({ success: false, message: 'Program not found.' });
    if (row.status === 'draft' && (!req.user || req.user.role !== 'admin')) {
      return res.status(404).json({ success: false, message: 'Program not found.' });
    }

    res.json({ success: true, data: formatProgram(row, locale) });
  } catch (err) {
    console.error('getOne program error:', err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// POST /api/programs (admin only)
const create = (req, res) => {
  try {
    const { slug, type, duration, level, featuredImage, status, order, translations } = req.body;

    if (!slug || !type) {
      return res.status(400).json({ success: false, message: 'Slug and type are required.' });
    }

    const existing = db.prepare('SELECT id FROM programs WHERE slug = ?').get(slug);
    if (existing) return res.status(409).json({ success: false, message: 'Slug already exists.' });

    const translationsJson = JSON.stringify(translations && typeof translations === 'object' ? translations : {});

    const result = db.prepare(`
      INSERT INTO programs (slug, type, duration, level, featured_image, status, sort_order, translations)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(slug, type, duration || '', level || '', featuredImage || null, status || 'draft', order || 0, translationsJson);

    const row = db.prepare('SELECT * FROM programs WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json({ success: true, message: 'Program created.', data: formatProgram(row, 'vi') });
  } catch (err) {
    console.error('create program error:', err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// PUT /api/programs/:id (admin only)
const update = (req, res) => {
  try {
    const { slug, type, duration, level, featuredImage, status, order, translations } = req.body;
    const existing = db.prepare('SELECT * FROM programs WHERE id = ?').get(req.params.id);
    if (!existing) return res.status(404).json({ success: false, message: 'Program not found.' });

    if (slug && slug !== existing.slug) {
      const slugCheck = db.prepare('SELECT id FROM programs WHERE slug = ?').get(slug);
      if (slugCheck) return res.status(409).json({ success: false, message: 'Slug already exists.' });
    }

    const newSlug = slug || existing.slug;
    const newType = type || existing.type;
    const newDuration = duration !== undefined ? duration : existing.duration;
    const newLevel = level !== undefined ? level : existing.level;
    const newFeaturedImage = featuredImage !== undefined ? featuredImage : existing.featured_image;
    const newStatus = status || existing.status;
    const newOrder = order !== undefined ? order : existing.sort_order;

    let newTranslations = JSON.parse(existing.translations || '{}');
    if (translations && typeof translations === 'object') {
      newTranslations = { ...newTranslations, ...translations };
    }

    db.prepare(`
      UPDATE programs SET slug = ?, type = ?, duration = ?, level = ?, featured_image = ?, status = ?, sort_order = ?, translations = ?, updated_at = datetime('now')
      WHERE id = ?
    `).run(newSlug, newType, newDuration, newLevel, newFeaturedImage, newStatus, newOrder, JSON.stringify(newTranslations), existing.id);

    const row = db.prepare('SELECT * FROM programs WHERE id = ?').get(existing.id);
    res.json({ success: true, message: 'Program updated.', data: formatProgram(row, 'vi') });
  } catch (err) {
    console.error('update program error:', err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// DELETE /api/programs/:id (admin only)
const remove = (req, res) => {
  try {
    const result = db.prepare('DELETE FROM programs WHERE id = ?').run(req.params.id);
    if (result.changes === 0) return res.status(404).json({ success: false, message: 'Program not found.' });
    res.json({ success: true, message: 'Program deleted.' });
  } catch (err) {
    console.error('delete program error:', err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

module.exports = { getAll, getOne, create, update, remove };
