import express from 'express';
import pool from '../db.js';

const router = express.Router();

// CREATE a full quiz set with questions
router.post('/', async (req, res) => {
  const { heading, topic, difficulty, class_id, status, questions } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO quiz_set (heading, topic, difficulty, class_id, status, questions, time)
       VALUES ($1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP)
       RETURNING *`,
      [ heading, topic, difficulty, class_id, status || 0, JSON.stringify(questions)]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Failed to create quiz set' });
  }
});

// READ all quiz sets with questions
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM quiz_set ORDER BY time DESC');
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Failed to fetch quiz sets' });
  }
});

// READ a specific quiz set by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM quiz_set WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Quiz set not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Failed to fetch quiz set' });
  }
});

// UPDATE a quiz set (update metadata and/or questions)
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { heading, topic, difficulty, class_id, status, questions } = req.body;

  try {
    const result = await pool.query(
      `UPDATE quiz_set
       SET heading = $1, topic = $2, difficulty = $3, class_id = $4, status = $5, questions = $6, time = CURRENT_TIMESTAMP
       WHERE id = $7
       RETURNING *`,
      [heading, topic, difficulty, class_id, status || 0, JSON.stringify(questions), id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Quiz set not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Failed to update quiz set' });
  }
});

// DELETE a quiz set
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      'DELETE FROM quiz_set WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Quiz set not found' });
    }

    res.json({ message: 'Quiz set deleted successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Failed to delete quiz set' });
  }
});

export default router;
