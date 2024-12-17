const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controllers')
const auth  = require('../middlewares/auth')

// ==> Rota responsavel por criar o novo 'User': (POST) localhost:3000/api/v1/register
router.post('/register', userController.registerNewUser);

// ==> Rota responsavel por fazer o login de usuarios e verifica;'ao: (POST) localhost:3000/api/v1/login
router.post('/login', userController.loginUser)


// ==> Rota responsavel por acessar o perfil do usuario: (GET) localhost:3000/api/v1/userProfile
router.get('/userProfile', auth, userController.returnUserProfile)

module.exports = router