import express from 'express'
import dotenv from 'dotenv'
import { connectDB } from './config/mongodb.js';
import cors from 'cors'
import cookieParser from 'cookie-parser';
import errorHandler from './middleware/errorHandlerMiddleware.js';


dotenv.config();
const app = express();
const PORT = process.env.PORT;

connectDB();


app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true, 
  methods: ['GET', 'POST', 'PUT', 'DELETE','PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(cookieParser())

app.get('/', (req, res) => {
  res.send('API is running...');
});

app.use(errorHandler)
app.listen(PORT, () => {
    console.log(`server running on ${PORT}`);
    
})