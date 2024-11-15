import express from 'express';
import cors from 'cors';
import diagnoseRouter from './routes/diagnoses';
import patientRouter from './routes/patientRouter';


const app = express();

app.use(cors({
  origin: 'http://localhost:5173', 
  methods: ['GET', 'POST', 'PUT', 'DELETE'],  
  allowedHeaders: ['Content-Type', 'Authorization'],  
}));

app.use('/api/diagnoses', diagnoseRouter);
app.use('/api/patients', patientRouter);
app.use(express.json());


const PORT = 3000;

app.get('/api/ping', (_req, res) => {
  console.log('someone pinged here');
  res.send('pong');
});


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
