//Dependencias=========================================
const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');

// ====================================================
if (!process.env.SECRET) process.env.SECRET = 'supersecret';
// ====================================================

//Morgan (desconocido)=================================
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//Middleware===========================================



//CORS - Mejorar middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  // res.header('Access-Control-Allow-Headers', '*');
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Headers', 'Access-Control-Allow-Origin, Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
    return res.status(200).json({});
  }
  next();
});

//Constantes que llaman a las rutas para ser corridas por el app.js
const testConexionMSSQL= require('./routesMSSQL/route.testConexion');
app.use('/testConexionMSSQL', testConexionMSSQL);

const testConexionPGSQL= require('./routesPGSQL/route.testConexion');
app.use('/testConexionPGSQL', testConexionPGSQL);

const connectMSSQLFile = require('./routesMSSQL/dbconnMSSQL').router;
app.use('/connectMSSQL', connectMSSQLFile);

const connectPGSQLFile = require('./routesPGSQL/dbconnPGSQL').router;
app.use('/connectPGSQL', connectPGSQLFile);

//NOT FOUND
app.use((req, res) => {
  res.sendStatus(404);
});

//ERROR
app.use((err, req, res) => {
  res.status(err.status || 500)
  .json({error:{message: err.message}});
});

module.exports = app;
