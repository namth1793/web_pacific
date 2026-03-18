const db = require('../db');

const formatComment = (row) => {
  if (!row) return null;
  return {
    id: row.id,
    article_id: row.article_id,
    content: row.content,
    status: row.status,
    guest_name: row.guest_name,
    guest_email: row.guest_email,
    created_at: row.created_at,
    updated_at: row.updated_at,
    author: row.author_id ? {
      id: row.author_id,
      name: row.author_name,
      email: row.author_email,
      avatar: row.author_avatar,
    } : null,
    article: row.article_slug ? {
      id: row.article_id,
      slug: row.article_slug,
      translations: row.article_translations ? JSON.parse(row.article_translations) : {},
    } : undefined,
  };
};

// GET /api/comments/article/:articleId
const getByArticle = (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const isAdmin = req.user && ['admin', 'moderator'].includes(req.user.role);
    const articleId = req.params.articleId;

    const conditions = ['c.article_id = ?'];
    const params = [articleId];

    if (!isAdmin) {
      conditions.push("c.status = 'approved'");
    }

    const where = 'WHERE ' + conditions.join(' AND ');
    const offset = (parseInt(page) - 1) * parseInt(limit);

    const rows = db.prepare(`
      SELECT c.*, u.name as author_name, u.email as author_email, u.avatar as author_avatar
      FROM comments c
      LEFT JOIN users u ON c.author_id = u.id
      ${where}
      ORDER BY c.created_at DESC
      LIMIT ? OFFSET ?
    `).all(...params, parseInt(limit), offset);

    const totalRow = db.prepare(`SELECT COUNT(*) as cnt FROM comments c ${where}`).get(...params);
    const total = totalRow ? totalRow.cnt : 0;

    res.json({
      success: true,
      data: rows.map(formatComment),
      pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / parseInt(limit)) },
    });
  } catch (err) {
    console.error('getByArticle comments error:', err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// POST /api/comments - anyone can post, status=pending
const create = (req, res) => {
  try {
    const { articleId, content, guestName, guestEmail } = req.body;
    if (!articleId) return res.status(400).json({ success: false, message: 'Article ID is required.' });
    if (!content || !content.trim()) return res.status(400).json({ success: false, message: 'Comment content is required.' });

    const article = db.prepare("SELECT id, status FROM articles WHERE id = ?").get(articleId);
    if (!article || article.status !== 'published') {
      return res.status(404).json({ success: false, message: 'Article not found.' });
    }

    let authorId = null;
    let gName = null;
    let gEmail = null;

    if (req.user) {
      authorId = req.user.id;
    } else {
      if (!guestName) return res.status(400).json({ success: false, message: 'Guest name is required.' });
      gName = guestName;
      gEmail = guestEmail || null;
    }

    const result = db.prepare(`
      INSERT INTO comments (article_id, author_id, guest_name, guest_email, content, status)
      VALUES (?, ?, ?, ?, ?, 'pending')
    `).run(articleId, authorId, gName, gEmail, content.trim());

    const row = db.prepare(`
      SELECT c.*, u.name as author_name, u.email as author_email, u.avatar as author_avatar
      FROM comments c LEFT JOIN users u ON c.author_id = u.id
      WHERE c.id = ?
    `).get(result.lastInsertRowid);

    res.status(201).json({
      success: true,
      message: 'Comment submitted and pending approval.',
      data: formatComment(row),
    });
  } catch (err) {
    console.error('create comment error:', err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// GET /api/comments (admin/moderator only - all)
const getAll = (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;

    const conditions = [];
    const params = [];
    if (status) {
      conditions.push('c.status = ?');
      params.push(status);
    }

    const where = conditions.length > 0 ? 'WHERE ' + conditions.join(' AND ') : '';
    const offset = (parseInt(page) - 1) * parseInt(limit);

    const rows = db.prepare(`
      SELECT c.*, u.name as author_name, u.email as author_email, u.avatar as author_avatar,
             a.slug as article_slug, a.translations as article_translations
      FROM comments c
      LEFT JOIN users u ON c.author_id = u.id
      LEFT JOIN articles a ON c.article_id = a.id
      ${where}
      ORDER BY c.created_at DESC
      LIMIT ? OFFSET ?
    `).all(...params, parseInt(limit), offset);

    const totalRow = db.prepare(`SELECT COUNT(*) as cnt FROM comments c ${where}`).get(...params);
    const total = totalRow ? totalRow.cnt : 0;

    res.json({
      success: true,
      data: rows.map(formatComment),
      pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / parseInt(limit)) },
    });
  } catch (err) {
    console.error('getAll comments error:', err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// PUT /api/comments/:id/approve
const approve = (req, res) => {
  try {
    const result = db.prepare("UPDATE comments SET status = 'approved', updated_at = datetime('now') WHERE id = ?").run(req.params.id);
    if (result.changes === 0) return res.status(404).json({ success: false, message: 'Comment not found.' });

    const row = db.prepare(`
      SELECT c.*, u.name as author_name, u.email as author_email, u.avatar as author_avatar
      FROM comments c LEFT JOIN users u ON c.author_id = u.id
      WHERE c.id = ?
    `).get(req.params.id);

    res.json({ success: true, message: 'Comment approved.', data: formatComment(row) });
  } catch (err) {
    console.error('approve comment error:', err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// PUT /api/comments/:id/reject
const reject = (req, res) => {
  try {
    const result = db.prepare("UPDATE comments SET status = 'rejected', updated_at = datetime('now') WHERE id = ?").run(req.params.id);
    if (result.changes === 0) return res.status(404).json({ success: false, message: 'Comment not found.' });

    const row = db.prepare('SELECT * FROM comments WHERE id = ?').get(req.params.id);
    res.json({ success: true, message: 'Comment rejected.', data: formatComment(row) });
  } catch (err) {
    console.error('reject comment error:', err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// DELETE /api/comments/:id
const remove = (req, res) => {
  try {
    const result = db.prepare('DELETE FROM comments WHERE id = ?').run(req.params.id);
    if (result.changes === 0) return res.status(404).json({ success: false, message: 'Comment not found.' });
    res.json({ success: true, message: 'Comment deleted.' });
  } catch (err) {
    console.error('delete comment error:', err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

module.exports = { getByArticle, create, getAll, approve, reject, remove };
