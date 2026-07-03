require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./db.js');

const app = express();

app.use(cors());
app.use(express.json());

// Public folder for photos
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
connectDB();


app.use('/api/auth', require('./routes/auth'));
app.use('/api/workers', require('./routes/worker'));
app.use('/api/requests', require('./routes/request'));


app.use('/api/admin', require('./routes/admin'));

app.get('/', (req, res) => {
    res.send("Local server is running...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`);
});