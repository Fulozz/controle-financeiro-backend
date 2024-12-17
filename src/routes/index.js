const express = require('express');

const router = express.Router();

router.post('', (req, res)=> {
    res.status(200).send({
        sucess: true,
        message: 'Seja bem-vindo(a) à nossa API',
        version: '1.0.0'
    })
})

module.exports = router;