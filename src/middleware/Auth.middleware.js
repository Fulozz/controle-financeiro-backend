const jwt = require('jsonwebtoken');

module.exports = (req, res, next)=>{
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if(token == null) return res.sendStatus(401); // Unauthorized
    jwt.verify(token, 'secrete', (err, user) => {
        if(err) return res.sendStatus(403); // Forbidden
        req.userData = user;
        next();
    });
};

