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

router.post('/validate-token', auth, (req, res)=>{
    if (req.isValid) {
        res.status(200).json({ valid: true, ok: true });
      } else {
        res.status(401).json({ valid: false, ok: false });
      }
})

// ==> Rota responsavel por atualizar o perfil do usuario: (PUT) localhost:3000/api/v1/user/update/:id
router.put('/user/update/:id', auth, userController.updateUserProfile);

module.exports = router
