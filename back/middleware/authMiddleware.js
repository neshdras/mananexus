const jwt = require('jsonwebtoken')
const db = require('../config/database')


const JWT_SECRET = process.env.JWT_SECRET

exports.authMiddleware = async (req, res, next) => {
    try {
        let token
        if(req.headers.authorization?.startsWith('Bearer'))
            token = req.headers.authorization.split(' ')[1]

        if(!token)
            return res.status(401).json({message: "Not authorized, token missing"})


        const decoded = jwt.verify(token, JWT_SECRET)
        const id = decoded.id
        const queryText = 'SELECT * FROM users WHERE id_user = $1'
        const userQuery = await db.query(queryText, [id])
        const user = userQuery.rows[0]
        
        if(!user)
            return res.status(401).json({message: "User no longer exists"})
        req.user = user
        next()
    } catch (err) {
        return res.status(401).json({message: 'Not authorized invalid token', error: err.message})
    }
}