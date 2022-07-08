//Imports
const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const app = express();

const userRoutes = require('./routes/user');
const sauceRoutes = require('./routes/sauce');

//Connections
mongoose.connect('mongodb+srv://admin:w4Qp9YkzKOOs22cd@cluster-hot-takes.mg8ja.mongodb.net/?retryWrites=true&w=majority',
  {
    useNewUrlParser : true,
    useUnifiedTopology : true,
  })
    .then(() => console.log('Connection to MongoDB successful!'))
    .catch(() => console.log('Connection to MongoDB failed!'));

//Access to the API from any origin
app.use((_req,_res,_next) => {
    _res.setHeader('Access-Control-Allow-Origin','*');
    _res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    _res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    _next();
});

//Request's body can be used
app.use(express.json());

//Routes
app.use('/api/auth', userRoutes);
app.use('/api/sauces', sauceRoutes);
app.use('/images', express.static(path.join(__dirname, 'images')));

//Exports
module.exports = app;