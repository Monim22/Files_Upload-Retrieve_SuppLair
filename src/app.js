const express = require('express');
const app = express();
const fileRoutes = require('./routes/fileRoutes');
const cors = require("cors");

app.use(cors());
app.use('/api', fileRoutes);

module.exports = app;