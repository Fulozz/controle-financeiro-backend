// src/app

const express = require('express')
const cors = require('cors');
const morgan = require('morgan');

// => Conexão com o banco de dados
const mongooseConnection = require('./database/mongooseConection.config');


// => Rotas da API

const index = require('./routes/index')

// => Configuração do servidor
const app = express();


app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use(express.json({ type: 'application/vnd.api+json' }))
app.use(cors());
app.use(morgan('dev'))

app.set("mongoose connection", mongooseConnection);

app.use(index);


module.exports = app;