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
const transactionRoutes = require('./routes/Transaction.routes')


app.use(express.urlencoded({ extended : true }));
app.use(express.json());
app.use(express.json({ type: 'application/vnd.api+json' }));

app.use(cors());
app.options(['http://localhost:3000', 'https://personal-daily-journal.vercel.app/'], cors());
app.use(morgan('dev'));

app.set("mongoose connection", mongooseConnection);

app.use(index);
app.use('/api/v1', userRoutes)
app.use('/api/v1', leadRoutes)
app.use('/api/v1', transactionRoutes)

module.exports = app;