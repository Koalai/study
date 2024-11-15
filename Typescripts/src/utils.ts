// validation.ts
import { Gender, NewPatient } from './types';

export const isNewPatient = (data: unknown): data is NewPatient => {
  if (typeof data !== 'object' || data === null) {
    return false;
  }

  const patient = data as { name: unknown; dateOfBirth: unknown; gender: unknown; occupation: unknown };

  if (
    typeof patient.name !== 'string' || patient.name.trim() === '' ||
    typeof patient.dateOfBirth !== 'string' || isNaN(Date.parse(patient.dateOfBirth)) ||
    !Object.values(Gender).includes(patient.gender as Gender) || 
    typeof patient.occupation !== 'string' || patient.occupation.trim() === ''
  ) {
    return false;
  }

  return true;
};
