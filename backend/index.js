const express = require('express')
const skillRouter = require('./routes/skills-router')
const userRouter = require('./routes/users-router')
const mongoose = require('mongoose')
const app = express()
const HttpError = require('./models/http-error')
require('dotenv').config()

app.use(express.json())

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');
    next();
});

app.use('/api/skills', skillRouter)
app.use('/api/users', userRouter)

app.use((req, res, next) => {
    const error = new HttpError('Could not find this route.', 404);
    throw error;
});

app.use((error, req, res, next) => {
    res.status(error.code || 500);
    res.json({ message: error.message || 'An unknown error occurred!' });
});

mongoose
  .connect(
    process.env.DB_URL
  )
  .then(() => {
    console.log("server started")
    app.listen(5000);
  })
  .catch(err => {
    console.log(err);
  });
