const db = require('../db');

const formatResearch = (row, locale) => {
  if (!row) return null;
  const translations = JSON.parse(row.translations || '{}');
  const trans = translations[locale] || translations['vi'] || {};
  return {
    id: row.id,
    slug: row.slug,
    type: row.type,
    year: row.year,
    authors: JSON.parse(row.authors || '[]'),
    tags: JSON.parse(row.tags || '[]'),
    featured_image: row.featured_image,
    status: row.status,
    translations,
    translation: trans,
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
};

// GET /api/research
const getAll = (req, res) => {
  try {
    const { type, year, tags, status, locale = 'vi', page = 1, limit = 10, search } = req.query;
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

    if (year) {
      conditions.push('year = ?');
      params.push(parseInt(year));
    }

    const where = conditions.length > 0 ? 'WHERE ' + conditions.join(' AND ') : '';
    const offset = (parseInt(page) - 1) * parseInt(limit);

    let rows = db.prepare(`
      SELECT * FROM research ${where}
      ORDER BY year DESC, created_at DESC
      LIMIT ? OFFSET ?
    `).all(...params, parseInt(limit), offset);

    const totalRow = db.prepare(`SELECT COUNT(*) as cnt FROM research ${where}`).get(...params);
    const total = totalRow ? totalRow.cnt : 0;

    let result = rows.map((row) => formatResearch(row, locale));

    // Filter by tags (JSON array search)
    if (tags) {
      const tagList = Array.isArray(tags) ? tags : tags.split(',');
      result = result.filter((r) => tagList.some((t) => r.tags.includes(t)));
    }

    if (search) {
      const searchLower = search.toLowerCase();
      result = result.filter((r) => (r.translation.title || '').toLowerCase().includes(searchLower));
    }

    res.json({
      success: true,
      data: result,
      pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / parseInt(limit)) },
    });
  } catch (err) {
    console.error('getAll research error:', err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// GET /api/research/:slug
const getOne = (req, res) => {
  try {
    const { locale = 'vi' } = req.query;
    const row = db.prepare('SELECT * FROM research WHERE slug = ?').get(req.params.slug);
    if (!row) return res.status(404).json({ success: false, message: 'Research not found.' });
    if (row.status === 'draft' && (!req.user || req.user.role !== 'admin')) {
      return res.status(404).json({ success: false, message: 'Research not found.' });
    }
    res.json({ success: true, data: formatResearch(row, locale) });
  } catch (err) {
    console.error('getOne research error:', err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// POST /api/research (admin only)
const create = (req, res) => {
  try {
    const { slug, type, year, authors, tags, featuredImage, status, translations } = req.body;

    if (!slug || !type || !year) {
      return res.status(400).json({ success: false, message: 'Slug, type, and year are required.' });
    }

    const existing = db.prepare('SELECT id FROM research WHERE slug = ?').get(slug);
    if (existing) return res.status(409).json({ success: false, message: 'Slug already exists.' });

    const translationsJson = JSON.stringify(translations && typeof translations === 'object' ? translations : {});
    const authorsJson = JSON.stringify(Array.isArray(authors) ? authors : []);
    const tagsJson = JSON.stringify(Array.isArray(tags) ? tags : []);

    const result = db.prepare(`
      INSERT INTO research (slug, type, year, authors, tags, featured_image, status, translations)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(slug, type, parseInt(year), authorsJson, tagsJson, featuredImage || null, status || 'draft', translationsJson);

    const row = db.prepare('SELECT * FROM research WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json({ success: true, message: 'Research created.', data: formatResearch(row, 'vi') });
  } catch (err) {
    console.error('create research error:', err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// PUT /api/research/:id (admin only)
const update = (req, res) => {
  try {
    const { slug, type, year, authors, tags, featuredImage, status, translations } = req.body;
    const existing = db.prepare('SELECT * FROM research WHERE id = ?').get(req.params.id);
    if (!existing) return res.status(404).json({ success: false, message: 'Research not found.' });

    if (slug && slug !== existing.slug) {
      const slugCheck = db.prepare('SELECT id FROM research WHERE slug = ?').get(slug);
      if (slugCheck) return res.status(409).json({ success: false, message: 'Slug already exists.' });
    }

    const newSlug = slug || existing.slug;
    const newType = type || existing.type;
    const newYear = year ? parseInt(year) : existing.year;
    const newAuthors = authors ? JSON.stringify(Array.isArray(authors) ? authors : []) : existing.authors;
    const newTags = tags ? JSON.stringify(Array.isArray(tags) ? tags : []) : existing.tags;
    const newFeaturedImage = featuredImage !== undefined ? featuredImage : existing.featured_image;
    const newStatus = status || existing.status;

    let newTranslations = JSON.parse(existing.translations || '{}');
    if (translations && typeof translations === 'object') {
      newTranslations = { ...newTranslations, ...translations };
    }

    db.prepare(`
      UPDATE research SET slug = ?, type = ?, year = ?, authors = ?, tags = ?, featured_image = ?, status = ?, translations = ?, updated_at = datetime('now')
      WHERE id = ?
    `).run(newSlug, newType, newYear, newAuthors, newTags, newFeaturedImage, newStatus, JSON.stringify(newTranslations), existing.id);

    const row = db.prepare('SELECT * FROM research WHERE id = ?').get(existing.id);
    res.json({ success: true, message: 'Research updated.', data: formatResearch(row, 'vi') });
  } catch (err) {
    console.error('update research error:', err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// DELETE /api/research/:id (admin only)
const remove = (req, res) => {
  try {
    const result = db.prepare('DELETE FROM research WHERE id = ?').run(req.params.id);
    if (result.changes === 0) return res.status(404).json({ success: false, message: 'Research not found.' });
    res.json({ success: true, message: 'Research deleted.' });
  } catch (err) {
    console.error('delete research error:', err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

module.exports = { getAll, getOne, create, update, remove };
