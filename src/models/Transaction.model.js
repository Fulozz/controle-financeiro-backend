const mongoose = require('mongoose')

const transactioSchema = mongoose.Schema;

const transactionSchema = new transactioSchema({
    userID: { type: String, required: true},
    data: { type: Date, required: true},
    mesRef: { type: String, required: true},
    valor: { type: Number, required: true},
    tipo: { type: String, required: true},
})

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction