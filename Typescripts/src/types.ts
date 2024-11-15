
export interface Diagnose{
    code: string;
    name: string;
    latin?: string
}
  
export enum Gender {
  Male = 'male',
  Female = 'female',
  Other = 'other'
}
  

 export type Person = {
    id: string;
    name: string;
    dateOfBirth: string;
    ssn: string;
    gender: Gender;
    occupation: string;
  };
  
 export type Patient = Pick<Person, 'id' | 'name' | 'dateOfBirth' | 'gender' | 'occupation'>;

export type NewPatient = Omit<Patient, 'id'>;