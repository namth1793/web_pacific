const db = require('../db');

const formatTest = (row, locale, includeQuestions = true, isAdmin = false) => {
  if (!row) return null;
  const translations = JSON.parse(row.translations || '{}');
  const trans = translations[locale] || translations['vi'] || {};
  const questions = JSON.parse(row.questions || '[]');

  const result = {
    id: row.id,
    slug: row.slug,
    category: row.category,
    duration: row.duration,
    passing_score: row.passing_score,
    status: row.status,
    translations,
    translation: trans,
    created_at: row.created_at,
    updated_at: row.updated_at,
  };

  if (includeQuestions) {
    result.questions = questions.map((q) => {
      if (isAdmin) return q;
      const { correctIndex, explanation, ...safe } = q;
      return safe;
    });
  }

  return result;
};

// GET /api/tests - list without questions
const getAll = (req, res) => {
  try {
    const { category, status, locale = 'vi' } = req.query;
    const isAdmin = req.user && req.user.role === 'admin';

    const conditions = [];
    const params = [];

    if (!isAdmin) {
      conditions.push('status = ?');
      params.push('active');
    } else if (status) {
      conditions.push('status = ?');
      params.push(status);
    }

    if (category) {
      conditions.push('category = ?');
      params.push(category);
    }

    const where = conditions.length > 0 ? 'WHERE ' + conditions.join(' AND ') : '';
    const rows = db.prepare(`SELECT * FROM tests ${where} ORDER BY category ASC, created_at ASC`).all(...params);

    const result = rows.map((row) => formatTest(row, locale, false, isAdmin));
    res.json({ success: true, data: result });
  } catch (err) {
    console.error('getAll tests error:', err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// GET /api/tests/:slug - with questions (strip correctIndex unless admin)
const getOne = (req, res) => {
  try {
    const { locale = 'vi' } = req.query;
    const isAdmin = req.user && req.user.role === 'admin';
    const row = db.prepare('SELECT * FROM tests WHERE slug = ?').get(req.params.slug);

    if (!row) return res.status(404).json({ success: false, message: 'Test not found.' });
    if (row.status === 'inactive' && !isAdmin) {
      return res.status(404).json({ success: false, message: 'Test not found.' });
    }

    res.json({ success: true, data: formatTest(row, locale, true, isAdmin) });
  } catch (err) {
    console.error('getOne test error:', err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// POST /api/tests/:id/submit - submit answers (auth required)
const submit = (req, res) => {
  try {
    const { answers } = req.body;
    if (!answers || !Array.isArray(answers)) {
      return res.status(400).json({ success: false, message: 'Answers array is required.' });
    }

    const test = db.prepare('SELECT * FROM tests WHERE id = ?').get(req.params.id);
    if (!test) return res.status(404).json({ success: false, message: 'Test not found.' });

    const questions = JSON.parse(test.questions || '[]');
    const resultAnswers = [];
    let correct = 0;

    for (const ans of answers) {
      const q = questions[ans.questionIndex];
      if (!q) continue;
      const isCorrect = q.correctIndex === ans.selectedIndex;
      if (isCorrect) correct++;
      resultAnswers.push({
        questionIndex: ans.questionIndex,
        selectedIndex: ans.selectedIndex,
        isCorrect,
      });
    }

    const totalQuestions = questions.length;
    const score = totalQuestions > 0 ? Math.round((correct / totalQuestions) * 100) : 0;
    const passed = score >= test.passing_score;

    const insertResult = db.prepare(`
      INSERT INTO test_results (test_id, user_id, score, total_questions, correct_answers, answers, passed)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(test.id, req.user.id, score, totalQuestions, correct, JSON.stringify(resultAnswers), passed ? 1 : 0);

    const correctAnswersMap = questions.map((q, i) => ({
      questionIndex: i,
      correctIndex: q.correctIndex,
      explanation: q.explanation,
    }));

    res.json({
      success: true,
      message: passed ? 'Congratulations! You passed!' : 'Test completed.',
      data: {
        resultId: insertResult.lastInsertRowid,
        score,
        totalQuestions,
        correctAnswers: correct,
        passed,
        passingScore: test.passing_score,
        answers: resultAnswers,
        correctAnswers: correctAnswersMap,
      },
    });
  } catch (err) {
    console.error('submit test error:', err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// GET /api/tests/results/my - get user's test results
const getMyResults = (req, res) => {
  try {
    const results = db.prepare(`
      SELECT tr.*, t.slug as test_slug, t.category as test_category, t.translations as test_translations
      FROM test_results tr
      LEFT JOIN tests t ON tr.test_id = t.id
      WHERE tr.user_id = ?
      ORDER BY tr.completed_at DESC
      LIMIT 20
    `).all(req.user.id);

    const formatted = results.map((r) => ({
      id: r.id,
      score: r.score,
      total_questions: r.total_questions,
      correct_answers: r.correct_answers,
      passed: Boolean(r.passed),
      answers: JSON.parse(r.answers || '[]'),
      completed_at: r.completed_at,
      test: {
        id: r.test_id,
        slug: r.test_slug,
        category: r.test_category,
        translations: JSON.parse(r.test_translations || '{}'),
      },
    }));

    res.json({ success: true, data: formatted });
  } catch (err) {
    console.error('getMyResults error:', err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// POST /api/tests (admin only)
const create = (req, res) => {
  try {
    const { slug, category, duration, passingScore, status, translations, questions } = req.body;

    if (!slug || !category) {
      return res.status(400).json({ success: false, message: 'Slug and category are required.' });
    }

    const existing = db.prepare('SELECT id FROM tests WHERE slug = ?').get(slug);
    if (existing) return res.status(409).json({ success: false, message: 'Slug already exists.' });

    const translationsJson = JSON.stringify(translations && typeof translations === 'object' ? translations : {});
    const questionsJson = JSON.stringify(Array.isArray(questions) ? questions : []);

    const result = db.prepare(`
      INSERT INTO tests (slug, category, duration, passing_score, status, translations, questions)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(slug, category, duration || 30, passingScore || 60, status || 'active', translationsJson, questionsJson);

    const row = db.prepare('SELECT * FROM tests WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json({ success: true, message: 'Test created.', data: formatTest(row, 'vi', true, true) });
  } catch (err) {
    console.error('create test error:', err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// PUT /api/tests/:id (admin only)
const update = (req, res) => {
  try {
    const { slug, category, duration, passingScore, status, translations, questions } = req.body;
    const existing = db.prepare('SELECT * FROM tests WHERE id = ?').get(req.params.id);
    if (!existing) return res.status(404).json({ success: false, message: 'Test not found.' });

    if (slug && slug !== existing.slug) {
      const slugCheck = db.prepare('SELECT id FROM tests WHERE slug = ?').get(slug);
      if (slugCheck) return res.status(409).json({ success: false, message: 'Slug already exists.' });
    }

    const newSlug = slug || existing.slug;
    const newCategory = category || existing.category;
    const newDuration = duration || existing.duration;
    const newPassingScore = passingScore || existing.passing_score;
    const newStatus = status || existing.status;
    const newQuestions = questions ? JSON.stringify(questions) : existing.questions;

    let newTranslations = JSON.parse(existing.translations || '{}');
    if (translations && typeof translations === 'object') {
      newTranslations = { ...newTranslations, ...translations };
    }

    db.prepare(`
      UPDATE tests SET slug = ?, category = ?, duration = ?, passing_score = ?, status = ?, translations = ?, questions = ?, updated_at = datetime('now')
      WHERE id = ?
    `).run(newSlug, newCategory, newDuration, newPassingScore, newStatus, JSON.stringify(newTranslations), newQuestions, existing.id);

    const row = db.prepare('SELECT * FROM tests WHERE id = ?').get(existing.id);
    res.json({ success: true, message: 'Test updated.', data: formatTest(row, 'vi', true, true) });
  } catch (err) {
    console.error('update test error:', err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// DELETE /api/tests/:id (admin only)
const remove = (req, res) => {
  try {
    const result = db.prepare('DELETE FROM tests WHERE id = ?').run(req.params.id);
    if (result.changes === 0) return res.status(404).json({ success: false, message: 'Test not found.' });
    res.json({ success: true, message: 'Test deleted.' });
  } catch (err) {
    console.error('delete test error:', err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

module.exports = { getAll, getOne, submit, getMyResults, create, update, remove };
