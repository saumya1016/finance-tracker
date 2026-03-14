require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();
connectDB();

// 1. IMPROVED CORS CONFIGURATION
const corsOptions = {
  origin: 'https://finance-tracker-five-phi-60.vercel.app', // Allow the Vercel URL
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Enable pre-flight for all routes

app.use(express.json());

// 2. ROUTE CHECK
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/transactions', require('./routes/transRoutes'));

// 3. HEALTH CHECK 
app.get('/', (req, res) => res.send('API Running'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));