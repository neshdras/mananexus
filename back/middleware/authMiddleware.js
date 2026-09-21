const jwt = require('jsonwebtoken')
const { findUserById } = require('../model/userModel')
const JWT_SECRET = process.env.JWT_SECRET

exports.authMiddleware = async (req, res, next) => {
    try {
        let token
        if(req.cookies.token)
            token = req.cookies.token

        if(!token)
            return res.status(401).json({message: "Not authorized, token missing"})

        const decoded = jwt.verify(token, JWT_SECRET)
        const id = decoded.id
        const user = await findUserById(id)
        
        if(!user)
            return res.status(401).json({message: "User no longer exists"})
        req.user = user
        next()
    } catch (err) {
        return res.status(401).json({message: 'Not authorized invalid token', error: err.message})
    }
}