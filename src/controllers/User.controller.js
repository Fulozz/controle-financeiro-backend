const User = require('../models/User.model')
const jwt = require('jsonwebtoken')

// TODO: unificar as transações ao usuario para ficar
// mais facil de fazer a consulta
// exemplo: User.find({email: req.body.email}).populate('transactions') 
// e assim por diante
// retornando no data: { user, transactions } os dados do usuario e as transações
exports.registerNewUser = async (req, res)=>{
    try {
        let isUser = await User.find({ email: req.body.email});
        if(isUser.length >= 1) {
            return res.status(409).json({ message: 'Sorry! This email is already registered!' });
        }
        const newUser = new User(req.body);
        const user = await newUser.save();
        const token =  await newUser.generateAuthToken();
        return res.status(201).json({ message: 'User created successfully!', user, token})
    } catch (error) {
        res.status(400).json({ error: error })
    }
};


exports.loginUser = async(req,res)=>{
    try {
        const email = req.body.email;
        const password = req.body.password;

        const user = await User.findByCredentials(email, password);

        if( !user ){
            return res.status(401).json({ error:'Erro ao realizar o login, verifique suas credenciais' })
        }
        const token = await user.generateAuthToken()

        return res.status(201).json({ message: ' Usuario(a) logado com sucesso!', user, token})

    } catch (err) {
        return res.status(400).json({ err: err })
    }

};

// ==> Método responsável por retornar todos os dados de um determinado 'User'
exports.returnUserProfile = async (req, res) => {
    await res.json( req.userData );
};

exports.updateUserProfile = async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'password', 'diaVencimento', 'currency'];
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));

    if (!isValidOperation) {
        return res.status(400).json({ error: 'Invalid updates!' });
    }

    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ error: 'User not found!' });
        }

        updates.forEach(update => {
            user[update] = req.body[update];
        });

        await user.save();

        res.status(200).json({ message: 'User updated successfully!', user });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
