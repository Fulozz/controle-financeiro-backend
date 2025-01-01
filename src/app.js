// src/app

const express = require('express')
const cors = require('cors');
const morgan = require('morgan');

// => Conexão com o banco de dados
const mongooseConnection = require('./database/mongooseConection.config');

// => Configuração do servidor
const app = express();

// => Rotas da API

const index = require('./routes/index')
const userRoutes = require('./routes/User.routes')
const leadRoutes = require('./routes/Lead.routes')



app.use(express.urlencoded({ extended : true }));
app.use(express.json());
app.use(express.json({ type: 'application/vnd.api+json' }));
app.use(cors());
app.use(morgan('dev'));

app.set("mongoose connection", mongooseConnection);

app.use(index);
app.use('/api/auth/callback', userRoutes)
app.use('/api/v1', leadRoutes)

module.exports = app;