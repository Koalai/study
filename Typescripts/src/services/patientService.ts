import patients from '../../data/patientEntries';
import { Patient } from '../types';


const getPatients = (): Patient[] => {
  return patients;
};

export default {
  getPatients
};