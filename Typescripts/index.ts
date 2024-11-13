import express from 'express';
import { calculateBmi} from './bmiCalculator';
import {calculateExercises} from './exerciseCalculator'

const app = express();
app.use(express.json());

app.get('/bmi', (req, res) => {
  const height = parseInt(req.query.height as string);
  const weight = parseInt(req.query.weight as string);

  if (isNaN(height) || isNaN(weight)) {
    res.status(400).json({
      error: 'malformatted parameters',
    });
  }

  const bmiResult = calculateBmi(height, weight);

  res.json({
    weight,
    height,
    bmi: bmiResult,
  });
});

app.post('/exercises', (req, res) => {
  
  const { daily_exercises, target } = req.body;

  if (!daily_exercises || target === undefined) {
    res.status(400).json({
      error: 'parameters missing', 
    });
  }


  if (!Array.isArray(daily_exercises) || isNaN(target)) {
    res.status(400).json({
      error: 'malformatted parameters', 
    });
  }


  if (!daily_exercises.every((e: number) => typeof e === 'number' && !isNaN(e))) {
    res.status(400).json({
      error: 'malformatted parameters', 
    });
  }

  const result = calculateExercises(daily_exercises, target);


  res.json(result);
});

const PORT = process.env.PORT || 3003;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
