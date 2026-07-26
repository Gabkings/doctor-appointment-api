const jwt = require("jsonwebtoken");

module.exports = async(req, res, next) => {
    try {
        const token = req.headers["authorization"].split(" ")[1];
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                return res.status(401).send({
                    message: "Auth failed",
                    success: false,
                });
            } else {
                // Attach authenticated user info without overwriting request data
                req.user = { id: decoded.id };
                
                // Only set userId if not already provided in request body
                if (!req.body.userId) {
                    req.body.userId = decoded.id;
                }
                
                next();
            }
        });
    } catch (error) {
        return res.status(401).send({
            message: "Auth failed",
            success: false,
        });
    }
};