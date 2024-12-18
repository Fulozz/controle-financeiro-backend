const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');


const Schema = mongoose.Schema;

const leadSchema = new Schema({
    email: { type: String, maxLenght: 30, required: true},
    name: { type: String, maxLenght: 50, required: true},
    phone: { type: Number, maxLenght: 50, required: true},
    company: { type: String, maxLenght: 50, required: true},
    message: { type: String, maxLenght: 150, required: true},  
    },{
    timestamps: true,
    collection: 'leads'
});

const Lead = mongoose.model('Lead', leadSchema);

module.exports = Lead;