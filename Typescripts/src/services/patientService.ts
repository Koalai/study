import patients from '../../data/patientEntries';
import { Patient, NewPatient} from '../types';
import { v1 as uuid } from 'uuid';


const getPatients = (): Patient[] => {
  return patients;
};

const addPatient = (entry: NewPatient): Patient => {
  const newPatient = {
    id: uuid(),
    ...entry
  };

  patients.push(newPatient);
  
  return newPatient;
};

export default {
  getPatients,
  addPatient
};