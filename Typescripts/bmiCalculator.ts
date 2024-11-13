

function calculateBmi(heightCm: number, weightKg: number): string {
  const heightM = heightCm / 100;
  const bmi = weightKg / (heightM * heightM);

  if (bmi < 18.5) {
    return 'Underweight';
  } else if (bmi >= 18.5 && bmi < 24.9) {
    return 'Normal range';
  } else if (bmi >= 25 && bmi < 29.9) {
    return 'Overweight';
  } else {
    return 'Obesity';
  }
}

const bmiArgs = process.argv.slice(2);

const heightCm = parseFloat(bmiArgs[0]);
const weightKg = parseFloat(bmiArgs[1]);

if (isNaN(heightCm) || isNaN(weightKg)) {
  console.error('Error: Both height and weight must be valid numbers.');
  process.exit(1);
}

const bmiResult = calculateBmi(heightCm, weightKg);
console.log(bmiResult);
