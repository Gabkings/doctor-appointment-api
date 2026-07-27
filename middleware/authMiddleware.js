const jwt = require("jsonwebtoken");
const User = require("../models/Usersmodel");
const secretJwt = require("../config/jwt");

const authMiddleware = async(req, res, next) => {
    try {
        const authHeader = req.headers["authorization"];
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).send({
                message: "Auth failed",
                success: false,
            });
        }

        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, secretJwt);
        const user = await User.findById(decoded.id).select("-password");

        if (!user) {
            return res.status(401).send({
                message: "Auth failed",
                success: false,
            });
        }

        req.user = {
            id: user._id.toString(),
            userId: user._id.toString(),
            role: user.isAdmin ? "admin" : user.isDoctor ? "doctor" : "user",
            isAdmin: Boolean(user.isAdmin),
            isDoctor: Boolean(user.isDoctor),
            ...user.toObject(),
        };

        if (!req.body.userId) {
            req.body.userId = req.user.id;
        }

        next();
    } catch (error) {
        return res.status(401).send({
            message: "Auth failed",
            success: false,
            error,
        });
    }
};

const authorizeRoles = (...allowedRoles) => (req, res, next) => {
    if (!req.user) {
        return res.status(401).send({
            message: "Auth failed",
            success: false,
        });
    }

    if (allowedRoles.includes(req.user.role)) {
        return next();
    }

    return res.status(403).send({
        message: "Access denied",
        success: false,
    });
};

module.exports = authMiddleware;
module.exports.authorizeRoles = authorizeRoles;