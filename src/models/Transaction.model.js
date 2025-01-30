const mongoose = require('mongoose')
const bcrypt = require('bcryptjs');

const Schema = mongoose.Schema;

const transactionSchema = new Schema({
    userID: { type: String, required: true},
    titulo: { type: String, required: true},
    diaVencimento: { type: String},
    mesRef: { type: String},
    categoria: { type: String},
    status: { type: String},
    formaPagamento: { type: String},
    parcelas: { type: Number},
    descricao: { type: String},
    valor: { type: Number, required: true},
    tipo: { type: String, required: true},
    date: { type: String, }
},{
    timestamps: true,
    collection: 'transactions'
})

transactionSchema.pre('save', async function(next) {
    try {
        if (this.isModified('valor')) {
            const salt = await bcrypt.genSalt(10);
            this.valor = await bcrypt.hash(this.valor.toString(), salt);
        }
        next();
    } catch (error) {
        next(error);
    }
});
transactionSchema.methods.compareValor = async function(valor) {
    try {
        return await bcrypt.compare(valor.toString(), this.valor);
    } catch (error) {
        throw new Error(error);
    }
};

transactionSchema.statics.findByUserID = async function(userID) {
    try {
        return await this.find({ userID });
    } catch (error) {
        throw new Error(error);
    }
};


const Transaction = mongoose.model('Transaction', transactionSchema);
module.exports = Transaction;