import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import routes from './routes/index.js';

// Middleware 
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false}));
app.use(cors());
app.use(morgan('dev'));
app.use(cookieParser());


// Database
import  {connect}  from './config/database.js';
connect();

// Routes 
// Routes 
app.use('/api/user', routes.authRoute);

// Server listenning
const PORT = process.env.PORT || 5000 ;
app.listen(PORT, () => {
    console.log('Server running on port ', PORT);
    
})