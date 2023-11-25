const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    if(req.headers && req.headers.authorization) {
        jwt.verify(req.headers.authorization, "THIS IS SECRET", function(err, decode) {
            if(err) {
                req.user = null;
                req.message = "Header verification failed, some issue with the token";
                next();
            } else {
                req.user = decode.id;
                req.message = "User found successfully";
                next();
            }
        });
    } else {
        req.user = null;
        req.message = "Authorization header not found";
        next();
    }
}

module.exports = verifyToken;