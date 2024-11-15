
export interface Diagnose{
    code: string;
    name: string;
    latin?: string
  }
  

 export type Person = {
    id: string;
    name: string;
    dateOfBirth: string;
    ssn: string;
    gender: string;
    occupation: string;
  };
  
 export type Patient = Pick<Person, 'id' | 'name' | 'dateOfBirth' | 'gender' | 'occupation'>;
