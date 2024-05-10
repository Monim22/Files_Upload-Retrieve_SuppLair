const express = require('express');
const app = express();
const fileRoutes = require('./routes/fileRoutes'); // Updated line

app.use('/api', fileRoutes);

module.exports = app;