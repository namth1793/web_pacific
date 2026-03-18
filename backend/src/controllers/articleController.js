const db = require('../db');

// Parse a DB row into a clean article object
const parseArticle = (row) => {
  if (!row) return null;
  return {
    ...row,
    translations: JSON.parse(row.translations || '{}'),
    featured_image: row.featured_image,
    author_id: row.author_id,
  };
};

// Get article with joined author info
const getArticleWithAuthor = (id) => {
  return db.prepare(`
    SELECT a.*, u.name as author_name, u.email as author_email, u.avatar as author_avatar
    FROM articles a
    LEFT JOIN users u ON a.author_id = u.id
    WHERE a.id = ?
  `).get(id);
};

const formatArticle = (row, locale) => {
  if (!row) return null;
  const translations = JSON.parse(row.translations || '{}');
  const trans = translations[locale] || translations['vi'] || {};
  return {
    id: row.id,
    slug: row.slug,
    status: row.status,
    category: row.category,
    featured_image: row.featured_image,
    views: row.views,
    published_at: row.published_at,
    created_at: row.created_at,
    updated_at: row.updated_at,
    translations,
    translation: trans,
    author: row.author_id ? {
      id: row.author_id,
      name: row.author_name,
      email: row.author_email,
      avatar: row.author_avatar,
    } : null,
  };
};

// GET /api/articles
const getAll = (req, res) => {
  try {
    const { page = 1, limit = 10, category, locale = 'vi', search, status } = req.query;
    const isAdmin = req.user && req.user.role === 'admin';

    const conditions = [];
    const params = [];

    if (!isAdmin) {
      conditions.push('a.status = ?');
      params.push('published');
    } else if (status) {
      conditions.push('a.status = ?');
      params.push(status);
    }

    if (category) {
      conditions.push('a.category = ?');
      params.push(category);
    }

    const where = conditions.length > 0 ? 'WHERE ' + conditions.join(' AND ') : '';

    const offset = (parseInt(page) - 1) * parseInt(limit);

    let rows = db.prepare(`
      SELECT a.*, u.name as author_name, u.email as author_email, u.avatar as author_avatar
      FROM articles a
      LEFT JOIN users u ON a.author_id = u.id
      ${where}
      ORDER BY a.published_at DESC, a.created_at DESC
      LIMIT ? OFFSET ?
    `).all(...params, parseInt(limit), offset);

    const totalRow = db.prepare(`SELECT COUNT(*) as cnt FROM articles a ${where}`).get(...params);
    const total = totalRow ? totalRow.cnt : 0;

    let result = rows.map((row) => formatArticle(row, locale));

    if (search) {
      const searchLower = search.toLowerCase();
      result = result.filter((a) => (a.translation.title || '').toLowerCase().includes(searchLower));
    }

    res.json({
      success: true,
      data: result,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (err) {
    console.error('getAll articles error:', err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// GET /api/articles/featured
const getFeatured = (req, res) => {
  try {
    const { locale = 'vi' } = req.query;
    const rows = db.prepare(`
      SELECT a.*, u.name as author_name, u.email as author_email, u.avatar as author_avatar
      FROM articles a
      LEFT JOIN users u ON a.author_id = u.id
      WHERE a.status = 'published'
      ORDER BY a.published_at DESC
      LIMIT 6
    `).all();

    const result = rows.map((row) => formatArticle(row, locale));
    res.json({ success: true, data: result });
  } catch (err) {
    console.error('getFeatured error:', err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// GET /api/articles/:slug
const getOne = (req, res) => {
  try {
    const { locale = 'vi' } = req.query;
    const row = db.prepare(`
      SELECT a.*, u.name as author_name, u.email as author_email, u.avatar as author_avatar
      FROM articles a
      LEFT JOIN users u ON a.author_id = u.id
      WHERE a.slug = ?
    `).get(req.params.slug);

    if (!row) {
      return res.status(404).json({ success: false, message: 'Article not found.' });
    }

    if (row.status === 'draft' && (!req.user || req.user.role !== 'admin')) {
      return res.status(404).json({ success: false, message: 'Article not found.' });
    }

    // Increment views
    db.prepare('UPDATE articles SET views = views + 1 WHERE id = ?').run(row.id);
    row.views += 1;

    res.json({ success: true, data: formatArticle(row, locale) });
  } catch (err) {
    console.error('getOne article error:', err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// POST /api/articles (admin only)
const create = (req, res) => {
  try {
    const { slug, category, status, featuredImage, publishedAt, translations } = req.body;

    if (!slug || !category) {
      return res.status(400).json({ success: false, message: 'Slug and category are required.' });
    }

    const existing = db.prepare('SELECT id FROM articles WHERE slug = ?').get(slug);
    if (existing) {
      return res.status(409).json({ success: false, message: 'Slug already exists.' });
    }

    const translationsJson = JSON.stringify(translations && typeof translations === 'object' ? translations : {});
    const articleStatus = status || 'draft';
    const pubAt = articleStatus === 'published' ? (publishedAt || new Date().toISOString()) : null;

    const result = db.prepare(`
      INSERT INTO articles (slug, category, status, featured_image, author_id, published_at, translations)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(slug, category, articleStatus, featuredImage || null, req.user.id, pubAt, translationsJson);

    const row = db.prepare(`
      SELECT a.*, u.name as author_name, u.email as author_email, u.avatar as author_avatar
      FROM articles a LEFT JOIN users u ON a.author_id = u.id
      WHERE a.id = ?
    `).get(result.lastInsertRowid);

    res.status(201).json({ success: true, message: 'Article created.', data: formatArticle(row, 'vi') });
  } catch (err) {
    console.error('create article error:', err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// PUT /api/articles/:id (admin only)
const update = (req, res) => {
  try {
    const { slug, category, status, featuredImage, publishedAt, translations } = req.body;

    const existing = db.prepare('SELECT * FROM articles WHERE id = ?').get(req.params.id);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Article not found.' });
    }

    if (slug && slug !== existing.slug) {
      const slugCheck = db.prepare('SELECT id FROM articles WHERE slug = ?').get(slug);
      if (slugCheck) return res.status(409).json({ success: false, message: 'Slug already exists.' });
    }

    const newSlug = slug || existing.slug;
    const newCategory = category || existing.category;
    const newStatus = status || existing.status;
    const newFeaturedImage = featuredImage !== undefined ? featuredImage : existing.featured_image;

    let newPublishedAt = existing.published_at;
    if (publishedAt) {
      newPublishedAt = publishedAt;
    } else if (status === 'published' && !existing.published_at) {
      newPublishedAt = new Date().toISOString();
    }

    let newTranslations = JSON.parse(existing.translations || '{}');
    if (translations && typeof translations === 'object') {
      newTranslations = { ...newTranslations, ...translations };
    }

    db.prepare(`
      UPDATE articles SET slug = ?, category = ?, status = ?, featured_image = ?, published_at = ?, translations = ?, updated_at = datetime('now')
      WHERE id = ?
    `).run(newSlug, newCategory, newStatus, newFeaturedImage, newPublishedAt, JSON.stringify(newTranslations), existing.id);

    const row = db.prepare(`
      SELECT a.*, u.name as author_name, u.email as author_email, u.avatar as author_avatar
      FROM articles a LEFT JOIN users u ON a.author_id = u.id
      WHERE a.id = ?
    `).get(existing.id);

    res.json({ success: true, message: 'Article updated.', data: formatArticle(row, 'vi') });
  } catch (err) {
    console.error('update article error:', err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// DELETE /api/articles/:id (admin only)
const remove = (req, res) => {
  try {
    const result = db.prepare('DELETE FROM articles WHERE id = ?').run(req.params.id);
    if (result.changes === 0) {
      return res.status(404).json({ success: false, message: 'Article not found.' });
    }
    res.json({ success: true, message: 'Article deleted.' });
  } catch (err) {
    console.error('delete article error:', err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

module.exports = { getAll, getOne, create, update, remove, getFeatured };
