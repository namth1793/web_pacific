const db = require('../db');
const nodemailer = require('nodemailer');

const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

// POST /api/contact/submit
const submit = (req, res) => {
  try {
    const { name, email, phone, subject, message, type, locale } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ success: false, message: 'Name, email, subject and message are required.' });
    }

    const result = db.prepare(`
      INSERT INTO contacts (name, email, phone, subject, message, type, status, locale)
      VALUES (?, ?, ?, ?, ?, ?, 'new', ?)
    `).run(name, email, phone || null, subject, message, type || 'general', locale || 'vi');

    // Send email notification (fire and forget)
    if (process.env.SMTP_USER && process.env.SMTP_PASS) {
      const transporter = createTransporter();
      transporter.sendMail({
        from: `"Japanese Faculty Website" <${process.env.SMTP_USER}>`,
        to: process.env.ADMIN_EMAIL,
        subject: `[New Contact] ${subject}`,
        html: `
          <h2>New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone || 'N/A'}</p>
          <p><strong>Type:</strong> ${type || 'general'}</p>
          <p><strong>Subject:</strong> ${subject}</p>
          <hr/>
          <p><strong>Message:</strong></p>
          <p>${message.replace(/\n/g, '<br>')}</p>
        `,
      }).catch((err) => console.error('Email send error:', err));
    }

    res.status(201).json({
      success: true,
      message: 'Thank you for contacting us. We will get back to you soon.',
      data: { id: result.lastInsertRowid },
    });
  } catch (err) {
    console.error('contact submit error:', err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// GET /api/contact (admin only)
const getAll = (req, res) => {
  try {
    const { status, type, page = 1, limit = 20 } = req.query;

    const conditions = [];
    const params = [];
    if (status) { conditions.push('status = ?'); params.push(status); }
    if (type) { conditions.push('type = ?'); params.push(type); }

    const where = conditions.length > 0 ? 'WHERE ' + conditions.join(' AND ') : '';
    const offset = (parseInt(page) - 1) * parseInt(limit);

    const contacts = db.prepare(`
      SELECT * FROM contacts ${where}
      ORDER BY created_at DESC
      LIMIT ? OFFSET ?
    `).all(...params, parseInt(limit), offset);

    const totalRow = db.prepare(`SELECT COUNT(*) as cnt FROM contacts ${where}`).get(...params);
    const total = totalRow ? totalRow.cnt : 0;

    res.json({
      success: true,
      data: contacts,
      pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / parseInt(limit)) },
    });
  } catch (err) {
    console.error('getAll contacts error:', err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// PUT /api/contact/:id/status (admin only)
const updateStatus = (req, res) => {
  try {
    const { status, adminNote } = req.body;
    const allowedStatuses = ['new', 'read', 'replied'];
    if (!status || !allowedStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status. Must be: new, read, or replied.' });
    }

    const updates = ["status = ?", "updated_at = datetime('now')"];
    const params = [status];

    if (adminNote !== undefined) {
      updates.push('admin_note = ?');
      params.push(adminNote);
    }

    params.push(req.params.id);

    const result = db.prepare(`UPDATE contacts SET ${updates.join(', ')} WHERE id = ?`).run(...params);
    if (result.changes === 0) return res.status(404).json({ success: false, message: 'Contact not found.' });

    const contact = db.prepare('SELECT * FROM contacts WHERE id = ?').get(req.params.id);
    res.json({ success: true, message: 'Status updated.', data: contact });
  } catch (err) {
    console.error('updateStatus contact error:', err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// DELETE /api/contact/:id (admin only)
const remove = (req, res) => {
  try {
    const result = db.prepare('DELETE FROM contacts WHERE id = ?').run(req.params.id);
    if (result.changes === 0) return res.status(404).json({ success: false, message: 'Contact not found.' });
    res.json({ success: true, message: 'Contact deleted.' });
  } catch (err) {
    console.error('delete contact error:', err);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

module.exports = { submit, getAll, updateStatus, remove };
