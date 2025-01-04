const express = require('express');
const router = express.Router();
const userController = require('../controllers/User.controller')
const auth  = require('../middleware/Auth.middleware')

// ==> Rota responsavel por criar o novo 'User': (POST) localhost:3000/api/v1/register
router.post('/register', userController.registerNewUser);

// ==> Rota responsavel por fazer o login de usuarios e verifica;'ao: (POST) localhost:3000/api/v1/login
router.post('/login', userController.loginUser)


// ==> Rota responsavel por acessar o perfil do usuario: (GET) localhost:3000/api/v1/userProfile
router.get('/profile', auth, userController.returnUserProfile)

router.get('/validate-token', auth, (req, res)=>{
    res.json({ isAuthenticated: true })
})

module.exports = router