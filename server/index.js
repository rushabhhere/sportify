const express = require('express');
const mongoose = require('mongoose');
const bearerToken = require('express-bearer-token');
require('dotenv').config();

const PORT = 7878;

const app = express();
app.use(express.json());
app.use(
  bearerToken({
    bodyKey: 'access_token',
    queryKey: 'access_token',
    headerKey: 'Bearer',
    reqKey: 'token',
    cookie: false,
  })
);

mongoose.connect(process.env.MONGODB_HOST);

app.use('/api/auth/', require('./routes/auth'));

app.listen(PORT, () => {
  console.log(`Listening on http://localhost:${PORT}`);
});
