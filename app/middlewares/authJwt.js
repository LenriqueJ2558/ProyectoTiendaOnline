const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const db = require("../models");
const User = db.user;
const Role = db.role;

verifyToken = (req, res, next) => {
    // Obtener el token del encabezado Authorization
    let token = req.headers["authorization"];
    
    // Verificar si el token comienza con "Bearer "
    if (token && token.startsWith("Bearer ")) {
        token = token.slice(7, token.length); // Eliminar "Bearer " del token
    } else {
        return res.status(403).send({ message: "No token provided!" });
    }

    if (!token) {
        return res.status(403).send({ message: "No token provided!" });
    }

    jwt.verify(token, config.secret, async (err, decoded) => {
        if (err) {
            return res.status(401).send({
                message: "Unauthorized!",
            });
        }
       

        try {
            // Buscar el usuario por el ID del token
            const user = await User.findById(decoded.id);
            if (!user) {
                return res.status(404).send({ message: "User not found!" });
            }
            req.user = user;
            req.userId = user._id;
            next();
        } catch (error) {
            res.status(500).send({ message: "Unable to fetch user data." });
        }
    });
};

isModerator = (req, res, next) => {
    User.findById(req.userId).exec((err, user) => {
        if (err) {
            res.status(500).send({ message: err });
            return;
        }
        if (!user) {
            return res.status(404).send({ message: "User not found!" });
        }

        Role.find(
            {
                _id: { $in: user.roles },
            },
            (err, roles) => {
                if (err) {
                    res.status(500).send({ message: err });
                    return;
                }

                for (let i = 0; i < roles.length; i++) {
                    if (roles[i].name === "moderator") {
                        next();
                        return;
                    }
                }

                res.status(403).send({ message: "Require Moderator Role!" });
                return;
            }
        );
    });
};

isAdmin = (req, res, next) => {
    User.findById(req.userId).exec((err, user) => {
        if (err) {
            res.status(500).send({ message: err });
            return;
        }
        if (!user) {
            return res.status(404).send({ message: "User not found!" });
        }

        Role.find(
            {
                _id: { $in: user.roles },
            },
            (err, roles) => {
                if (err) {
                    res.status(500).send({ message: err });
                    return;
                }

                for (let i = 0; i < roles.length; i++) {
                    if (roles[i].name === "admin") {
                        next();
                        return;
                    }
                }

                res.status(403).send({ message: "Require Admin Role!" });
                return;
            }
        );
    });
};
const authJwt = {
    verifyToken, isModerator, isAdmin
};
module.exports = authJwt;  