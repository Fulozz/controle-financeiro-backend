const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const transactionSchema = new Schema({
    userID: { type: String, required: true},
    mesRef: { type: String, required: true},
    formaPagamento: { type: String, required: true},
    parcelas: { type: Number, required: false},
    descricao: { type: String, required: true},
    valor: { type: Number, required: true},
    tipo: { type: String, required: true},
    date: { type: String,  required: true }
},{
    timestamps: true,
    collection: 'transactions'
})

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;