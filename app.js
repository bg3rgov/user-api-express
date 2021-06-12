const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./routes/userRoutes');

const app = express();
mongoose.connect
(
    'YOUR-DATABASE-CONNECTION-STRING',
    {useNewUrlParser: true, useUnifiedTopology: true}
).then(() => {

    console.log('Connected to MongoDB');
}).catch(() => {

    console.log('Connection failed!');
})

app.use(express.json());
app.use(express.urlencoded({extended:false}));

app.use('/api/user', userRoutes);

module.exports = app;
