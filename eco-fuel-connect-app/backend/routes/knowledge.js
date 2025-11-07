const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const db = require('../config/database').sequelize;

// Get all articles (public)
router.get('/articles', async (req, res) => {
  try {
    const { category, difficulty } = req.query;
    let query = 'SELECT * FROM knowledge_articles WHERE isPublished = true';
    const params = [];

    if (category) {
      query += ' AND category = ?';
      params.push(category);
    }
    if (difficulty) {
      query += ' AND difficulty = ?';
      params.push(difficulty);
    }

    query += ' ORDER BY views DESC, createdAt DESC';

    const [articles] = await db.query(query, params);
    res.json({ success: true, articles });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get single article
router.get('/articles/:id', async (req, res) => {
  try {
    const [articles] = await db.query(
      'SELECT * FROM knowledge_articles WHERE id = ? AND isPublished = true',
      [req.params.id]
    );

    if (articles.length === 0) {
      return res.status(404).json({ success: false, message: 'Article not found' });
    }

    // Increment views
    await db.query('UPDATE knowledge_articles SET views = views + 1 WHERE id = ?', [req.params.id]);

    res.json({ success: true, article: articles[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Admin: Create article
router.post('/articles', auth, async (req, res) => {
  try {
    const { title, content, summary, category, difficulty, videoUrl, thumbnailUrl } = req.body;

    const [result] = await db.query(`
      INSERT INTO knowledge_articles 
      (title, content, summary, category, difficulty, videoUrl, thumbnailUrl, createdBy, publishedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())
    `, [title, content, summary, category, difficulty, videoUrl, thumbnailUrl, req.user.id]);

    res.json({ success: true, articleId: result.insertId });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Admin: Update article
router.put('/articles/:id', auth, async (req, res) => {
  try {
    const { title, content, summary, category, difficulty, videoUrl, thumbnailUrl, isPublished } = req.body;

    await db.query(`
      UPDATE knowledge_articles 
      SET title = ?, content = ?, summary = ?, category = ?, 
          difficulty = ?, videoUrl = ?, thumbnailUrl = ?, isPublished = ?
      WHERE id = ?
    `, [title, content, summary, category, difficulty, videoUrl, thumbnailUrl, isPublished, req.params.id]);

    res.json({ success: true, message: 'Article updated' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Admin: Delete article
router.delete('/articles/:id', auth, async (req, res) => {
  try {
    await db.query('DELETE FROM knowledge_articles WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'Article deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get featured articles for welcome page
router.get('/featured', async (req, res) => {
  try {
    const [articles] = await db.query(`
      SELECT ka.*, fa.displayOrder
      FROM featured_articles fa
      JOIN knowledge_articles ka ON fa.articleId = ka.id
      WHERE fa.isActive = true AND ka.isPublished = true
      ORDER BY fa.displayOrder ASC
      LIMIT 3
    `);

    res.json({ success: true, articles });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Admin: Set featured articles
router.post('/featured', auth, async (req, res) => {
  try {
    const { articleId, displayOrder } = req.body;

    await db.query(`
      INSERT INTO featured_articles (articleId, displayOrder, createdBy)
      VALUES (?, ?, ?)
      ON DUPLICATE KEY UPDATE displayOrder = ?, isActive = true
    `, [articleId, displayOrder, req.user.id, displayOrder]);

    res.json({ success: true, message: 'Featured article set' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
