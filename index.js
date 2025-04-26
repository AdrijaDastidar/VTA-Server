// index.js
import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import pool from './db.js';
import quizRouter from './Routes/quiz.js';
import summaryRouter from './Routes/summary.js';
import studentRouter from './Routes/student.js';
import teacherRouter from './Routes/teacher.js';

const app = express();
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 1000;

app.listen(port, async () => {
  console.log(`Server is listening on port ${port}`);
  
  try {
    const res = await pool.query('SELECT NOW()');
    console.log('Database connected at:', res.rows[0].now);
  } catch (err) {
    console.error('Database connection error:', err);
  }
});


// Routes
app.use('/quiz', quizRouter);
app.use('/summary', summaryRouter);
app.use('/student', studentRouter);
app.use('/teacher', teacherRouter);

