
interface ExerciseResult {
  periodLength: number;
  trainingDays: number;
  success: boolean;
  rating: number;
  ratingDescription: string;
  target: number;
  average: number;
}


export function calculateExercises(
  exercises: number[],
  target: number
): ExerciseResult {
  const periodLength = exercises.length;
  const trainingDays = exercises.filter((day) => day > 0).length;
  const average = exercises.reduce((sum, day) => sum + day, 0) / periodLength;
  const success = average >= target;


  let rating: number;
  let ratingDescription: string;

  if (average >= target) {
    rating = 3;
    ratingDescription = 'Great job! You met your target.';
  } else if (average >= target * 0.75) {
    rating = 2;
    ratingDescription = 'Not too bad but could be better.';
  } else {
    rating = 1;
    ratingDescription = 'You should try harder.';
  }

  return {
    periodLength,
    trainingDays,
    success,
    rating,
    ratingDescription,
    target,
    average,
  };
}


const args = process.argv.slice(2);


const target = parseInt(args[0]);
if (isNaN(target)) {
  console.error('Error: Target must be a valid number.');
  process.exit(1);
}

const exercises = args.slice(1).map((arg) => parseInt(arg));
if (exercises.some(isNaN)) {
  console.error('Error: All exercise hours must be valid numbers.');
  process.exit(1);
}


const result = calculateExercises(exercises, target);
console.log(result);
