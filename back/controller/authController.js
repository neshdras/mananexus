const db = require('../config/database')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const JWT_SECRET = process.env.JWT_SECRET
const JWT_EXPIRE_IN = '24h'

const generateToken = (id, expire) => {
    return jwt.sign({id}, JWT_SECRET, {
        expiresIn: expire
    } )
}

exports.register = async (req, res) => {
    const { firstname, lastname, email, password} = req.body
    const pseudo = req.body.pseudo || null
    const picture = req.body.picture

    
    if(!firstname|| !lastname || !email || !password)
        return res.status(400).json({message: "Please provide the information ask"})

    const isPasswordOk = validator.isStrongPassword(password, {
        minLength: 6,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers:1,
        minSymbols:1
    })

    if(!isPasswordOk)
        return res.status(400).json({message: "The password need to have 1 lower, 1 upper, 1 number and 1 symbol and 6 character long min"})

    const isEmailValid = validator.isEmail(email)

    if(!isEmailValid)
        return res.status(400).json({message: "Please provide a valid email"})

    const minLength = pseudo == null ? true : validator.isByteLength(pseudo, 3)

    if(!minLength)
        return res.status(400).json({message: "Pseudo need to have at least 3 characters"})

    
    const textUser = 'SELECT count(*) FROM users WHERE email_user = $1'

    const isExistingUser = await db.query(textUser, [email])
    
    if(isExistingUser.rows[0].count == 1)
        return res.status(400).json({message: "Email already use"})
    
    const textPseudo = 'SELECT count(*) FROM users WHERE pseudo_user = $1'

    const isExistingPseudo = await db.query(textPseudo, [pseudo])
    
    if(isExistingPseudo.rows[0].count == 1)
        return res.status(400).json({message: "Pseudo already use"})
    

    const hash = await bcrypt.hash(password, 15)

    const insertText = 'INSERT INTO users(firstname_user, lastname_user, pseudo_user, email_user, password_user, picture_user) VALUES($1, $2, $3, $4, $5, $6) RETURNING firstname_user, lastname_user, pseudo_user, email_user, picture_user'

    const insertValue = [firstname, lastname, pseudo, email, hash, picture]
    const result = await db.query(insertText, insertValue)
    const user = result.rows[0]
    const token = generateToken(user.id_user, JWT_EXPIRE_IN)
    res.status(201).json({
        message: "User create successfully",
        token,
        user
    })
}

exports.login = async (req, res) =>{
    const {identifiant, password} = req.body

    let queryText
    // min char 4*5
    const minLength = validator.isByteLength(identifiant, 3)
    if(!minLength)
        return res.status(400).json({message: "Please provide the information"})

    const isEmail = validator.isEmail(identifiant)

    if (!isEmail) {
        queryText = 'SELECT COUNT(*), * FROM users WHERE pseudo_user= $1 GROUP BY id_user'
    }
    if(isEmail){
        queryText = 'SELECT *, COUNT(*) FROM users WHERE email_user = $1 GROUP BY id_user'
    }

    const query = await db.query(queryText, [identifiant])
    const isExistingUser = query.rows[0].count == 1
    
    if(!isExistingUser) 
        return res.status(400).json({message: "Please provide the information"})

    const isMatching = await bcrypt.compare(password, query.rowCount[0].password_user)
    if(!isMatching)
        return res.status(400).json({message: "Please provide the information"})

    const user = query.rows[0]
    const token = generateToken(user.id_user, JWT_EXPIRE_IN)
    
    res.status(200).json({
        message: "Login successfully",
        token,
        user
    })
}

exports.sendToken = async (req, res) => {
    const {email}= req.body
    const isValid = validator.isEmail(email)
    if(!isValid)
        return res.status(400).json({message: "Please provide a good email"})

    const countText = 'SELECT id_user, COUNT(*) FROM users WHERE email_user = $1 GROUP BY id_user'
    const countResult = await db.query(countText, [email])
    const id = countResult.rows[0].id_user
    if(countResult.rows[0].count != 1)
        return res.status(400).json({message: "Please provide the information ask."})

    const token = generateToken(id, '15min')
    await db.query('UPDATE users SET token_password_forget = $1 WHERE id_user = $2', [token, id])
    res.json({token})
}

exports.forgetPass = async (req, res) => {
    try {
        const { password } = req.body
        const token = req.params.token
    
        const decoded = jwt.verify(token, JWT_SECRET)

        const isStock = await (await db.query('SELECT COUNT(*) FROM users WHERE token_password_forget = $1 AND id_user = $2', [token, decoded.id])).rows[0].count == 1
        
        if(!isStock)
            return res.status(400).json({message: 'Wrong information'})
        
        const isPasswordOk = validator.isStrongPassword(password, {
            minLength: 6,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers:1,
            minSymbols:1
        })

        if(!isPasswordOk)
            return res.status(400).json({message: "The password need to have 1 lower, 1 upper, 1 number and 1 symbol and 6 character long min"})

        const hash = await bcrypt.hash(password, 15)
        const textPass = 'UPDATE users SET password_user = $1, token_password_forget = null WHERE id_user = $2'
        const valuePass = [hash, decoded.id]
        await db.query(textPass, valuePass)

        res.json({message: "Password has been modified"})
    } catch (err) {
        res.status(500).json({message: err.message})
    }   

}