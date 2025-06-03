import express from 'express'
import dotenv from 'dotenv'
import { connectDB } from './config/mongodb.js';
import cors from 'cors'
import cookieParser from 'cookie-parser';
import { errorHandler } from './middleware/errorHandlerMiddleware.js';


import authRoutes from './routes/authRoutes.js'
import userRoutes from './routes/userRoutes.js'
import agentRoutes from './routes/agentRoutes.js'
import PropertyRoutes from './routes/propertyRoutes.js'
import subscriptionRoutes from './routes/subscriptionRoutes.js'

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

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/agent', agentRoutes);
app.use('/api/property', PropertyRoutes);
app.use(
  '/api/subscription/webhook',
  express.raw({ type: 'application/json' }),
  subscriptionRoutes
);
app.use('/api', subscriptionRoutes);





app.listen(PORT, () => {
    console.log(`server running on ${PORT}`);
    
})