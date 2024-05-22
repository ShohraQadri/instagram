const jwt = require("jsonwebtoken")
const { jwt_secret } = require("../keys")
const mongoose = require("mongoose")
const USER = mongoose.model("USER")

module.exports = (req, res, next) => {
    const { authorization } = req.headers;
    console.log("authorization === ", authorization);
    if (!authorization) {
        return res.status(401).json({ error: "You must have logged in 1" })
    }
    const token = authorization.replace("Bearer ", "")
    console.log("token === ", token);
    jwt.verify(token, jwt_secret, (err, payload) => {
        if (err) {
            return res.status(401).json({ error: "You must have logged in 2", err })
        }
        const { _id } = payload
        USER.findById(_id).then(userData => {
            req.user = userData
            next()
        })
    })

}