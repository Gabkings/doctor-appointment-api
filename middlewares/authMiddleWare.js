const jwt = require('jsonwebtoken')

module.exports = async(req, res, next) => {
    try {
        const token = req.headers['authorization'].split(" ")[1]
        jwt.verify(token, process.env.JWT_SECRET, (error, decode) => {
            if (error) {
                return res.status(401).send({
                    message: error.message,
                    success: false,
                });
            } else {
                req.body.userId = decode.id;
                next();
            }
        })
    } catch (error) {
        res.status(401).send({ message: error.message, success: false })
    }
}