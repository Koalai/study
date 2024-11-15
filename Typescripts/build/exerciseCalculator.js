"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateExercises = calculateExercises;
function calculateExercises(exercises, target) {
    const periodLength = exercises.length;
    const trainingDays = exercises.filter((day) => day > 0).length;
    const average = exercises.reduce((sum, day) => sum + day, 0) / periodLength;
    const success = average >= target;
    let rating;
    let ratingDescription;
    if (average >= target) {
        rating = 3;
        ratingDescription = 'Great job! You met your target.';
    }
    else if (average >= target * 0.75) {
        rating = 2;
        ratingDescription = 'Not too bad but could be better.';
    }
    else {
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
