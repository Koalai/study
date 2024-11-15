"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
const express_1 = __importDefault(require("express"));
const patientService_1 = __importDefault(require("../services/patientService"));
const router = express_1.default.Router();
router.get('/', (_req, res) => {
    res.send(patientService_1.default.getPatients());
});
router.post('/', (req, res) => {
    const { name, dateOfBirth, gender, occupation } = req.body;
    if (!name || !dateOfBirth || !gender || !occupation) {
        res.status(400).json({ error: 'Missing required fields' });
    }
    ;
    const addedPatient = patientService_1.default.addPatient({ name, dateOfBirth, gender, occupation });
    res.json(addedPatient);
});
exports.default = router;
