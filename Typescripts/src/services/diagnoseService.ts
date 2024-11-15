import diagnose from '../../data/diagnoseEntries';
import { Diagnose } from '../types';


const getDiagnoses = (): Diagnose[] => {
  return diagnose;
};

export default {
  getDiagnoses
};