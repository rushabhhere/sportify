const express = require('express');
const mongoose = require('mongoose');
const bearerToken = require('express-bearer-token');
const path = require('path');
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

app.use(express.static(path.resolve(__dirname, '../client/static')));

app.use('/', require('./routes/public'));
app.use('/api/auth/', require('./routes/auth'));
app.use('/api/events/', require('./routes/events'));

app.listen(PORT, () => {
  console.log(`Listening on http://localhost:${PORT}`);
});
