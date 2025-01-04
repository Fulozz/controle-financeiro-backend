const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();
module.exports = (req, res, next)=>{
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if(token == null) return res.sendStatus(401); // Unauthorized
    jwt.verify(token, process.env.JWT_KEY, (err, user) => {
        if(err) return res.sendStatus(403); // Forbidden
        req.userData = user;
        next();
    });
};

