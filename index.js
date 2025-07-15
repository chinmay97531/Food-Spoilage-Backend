import express from 'express';
import cors from 'cors';
import detectionRouter from './routes/FoodSpilageDetection.js';
const app = express();
const PORT = 3000;


app.use(cors());
app.use(express.json());
app.use('/api/v1/FoodSpilageDetection', detectionRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}
);