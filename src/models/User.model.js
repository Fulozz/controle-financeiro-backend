const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: { type: String, maxLenght: 50, required: true},
    email: { type: String, maxLenght: 30, required: true, unique: true},
    password: { type: String, maxLenght: 50, required: true},
    diaVencimento: { type: String},
    currency: { type: String},
    tokens: [{
        token: { type: String, required: true}
    }
  ],
},{
    timestamps: true,
    collection: 'users'
});

// => Criptografia da senha

userSchema.pre('save', async function(next){
    const user = this;
    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password, 8)
    }
    next();
})

// => Gerar a autenticacao

userSchema.methods.generateAuthToken = async function(){
    const user = this;
    const token = jwt.sign({ _id: user._id, name: user.name, email: user.email, diaVencimento: user.diaVencimento}, process.env.JWT_KEY);
    user.tokens = user.tokens.concat({ token });
    await user.save();

    return token
};

// => Buscar usuario por credenciais
userSchema.statics.findByCredentials = async(email, password) =>{
    const user = await User.findOne({ email });
    if(!user){
        throw new Error({ erro: 'Login invalido'});
    }
    const isPassowordMatch = await  bcrypt.compare(password, user.password);
    if(!isPassowordMatch){
        throw new Error({ erro: 'Senha invalida'});
    }
    return user;
};


const User = mongoose.model('User', userSchema);


module.exports = User;