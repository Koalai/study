/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import express from 'express';
import patientService from '../services/patientService';
import { isNewPatient } from '../utils';

const router = express.Router();

router.get('/', (_req, res) => {
    try {
    const patients = patientService.getPatients();
    res.json(patients);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch patients' });
  }
});

router.post('/', (req, res) => {
    const { name, dateOfBirth, gender, occupation } = req.body;

    if (!isNewPatient(req.body)) {
        res.status(400).json({ error: 'Invalid or missing required fields' });
      }

      try {
        const addedPatient = patientService.addPatient({name, dateOfBirth, gender, occupation});
        res.status(201).json(addedPatient);
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to add new patient' });
      }
});

export default router;