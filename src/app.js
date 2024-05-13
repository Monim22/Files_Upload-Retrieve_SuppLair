const express = require('express');
const app = express();
const fileRoutes = require('./routes/fileRoutes');

app.use('/api', fileRoutes);

module.exports = app;