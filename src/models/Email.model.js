const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');


const Schema = mongoose.Schema;

const emailSchema = new Schema({
    email: { type: String, maxLenght: 30, required: true, unique: true},
    tokens: [{
        token: { type: String, required: true}
    }
  ],
},{
    timestamps: true,
    collection: 'emails'
});