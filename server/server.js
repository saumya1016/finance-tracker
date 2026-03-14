require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();

// Connect to MongoDB
connectDB();

// 1. UPDATED CORS CONFIGURATION
const corsOptions = {
  origin: 'https://finance-tracker-five-phi-60.vercel.app',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 200
};

// Use the CORS middleware globally
app.use(cors(corsOptions));

app.options('*', cors(corsOptions)); 

app.use(express.json());

// 2. ROUTES
// Important: Ensure  frontend adds /api to the base URL
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/transactions', require('./routes/transRoutes'));

// 3. HEALTH CHECK & ROOT
app.get('/', (req, res) => res.send('Finance Tracker API is Running...'));

// 4. PORT CONFIGURATION
// Render automatically provides a PORT environment variable
const PORT = process.env.PORT || 10000; 

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});