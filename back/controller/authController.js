const db = require('../config/database')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { findUserByEmail, findUserByPseudo, createUser, resetToken, verifyToken, udpatePassword } = require('../model/userModel')

const JWT_SECRET = process.env.JWT_SECRET


    const generateToken = (id, expire) => {
        return jwt.sign({id}, JWT_SECRET, {
            expiresIn: expire
        } )
    }

exports.register = async (req, res) => {
    const { firstname, lastname, email, password} = req.body
    const pseudo = req.body.pseudo || null
    const picture = req.body.picture || null

    
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

    const isExistingUser = await findUserByEmail(email)
    if(isExistingUser)
        return res.status(400).json({message: "Email already use"})
    
    const isExistingPseudo = await findUserByPseudo(pseudo)
    if(isExistingPseudo)
        return res.status(400).json({message: "Pseudo already use"})
    
    const hash = await bcrypt.hash(password, 15)

    const insertValue = [firstname, lastname, pseudo, email, hash, picture]

    const user = await createUser(insertValue)
    const tokenRefresh = generateToken(user.id_user, '7d')
    const tokenAccess = generateToken(user.id_user, 900) // 900seconde = 15min
    res.cookie("token", tokenRefresh,{
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        maxAge: 7*24*60*60*1000
    })
    res.status(201).json({
        message: "User create successfully",
        token: tokenAccess,
        user
    })
}

exports.login = async (req, res) =>{
    const {identifiant, password} = req.body
    if(!identifiant || !password)
        return res.status(400).json({message: "Please provide the information"})

    let user
    const minLength = validator.isByteLength(identifiant, 3)
    if(!minLength)
        return res.status(400).json({message: "Please provide the information"})

    const isEmail = validator.isEmail(identifiant)

    if (!isEmail) {
        user = await findUserByPseudo(identifiant)
    }
    if(isEmail){
        user = await findUserByEmail(identifiant)
    }

    if(!user)
        return res.status(404).json({message: "Please provide the information"})

    const isMatching = await bcrypt.compare(password, user.password_user)
    if(!isMatching)
        return res.status(400).json({message: "Please provide the information"})

    
    const tokenRefresh = generateToken(user.id_user, '7d')
    const tokenAccess = generateToken(user.id_user, 900) // 900seconde = 15min

    res.cookie("tokenRefresh", tokenRefresh, {
        httpOnly: true,
        secure: false,
        sameSite:'lax',
        maxAge: 7*24*60*60*1000
    })
    res.cookie("tokenAccess", tokenAccess, {
        httpOnly: true,
        secure: false,
        sameSite:'lax',
        maxAge: 15*60*1000
    })
    res.status(200).json({
        message: "Login successfully",
        user:{
            id_user: user.id_user,
            firstname_user: user.firstname_user,
            lastname_user: user.lastname_user,
            pseudo_user: user.pseudo_user,
            email_user: user.email_user,
            picture_user: user.picture_user
        }
    })
}

exports.sendToken = async (req, res) => {
    const {email}= req.body
    const isValid = validator.isEmail(email)
    if(!isValid)
        return res.status(400).json({message: "Please provide a good email"})

    const user = await findUserByEmail(email)
    if(!user)
        return res.status(400).json({message: "Please provide the information ask."})
    
    const id = user.id_user
    const token = generateToken(id, '15min')
    await resetToken(token)
    res.json({token})
}

exports.forgetPass = async (req, res) => {
    try {
        const { password } = req.body
        const token = req.params.token

        const decoded = jwt.verify(token, JWT_SECRET)
        
        const isPasswordOk = validator.isStrongPassword(password, {
            minLength: 6,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers:1,
            minSymbols:1
        })
        if(!isPasswordOk)
            return res.status(400).json({message: "The password need to have 1 lower, 1 upper, 1 number and 1 symbol and 6 character long min"})
        
        const isStock = await verifyToken(token, decoded.id) == 1
        
        if(!isStock)
            return res.status(400).json({message: 'Wrong information'})
        
        const hash = await bcrypt.hash(password, 15)

        await udpatePassword(hash, decoded.id)
        res.json({message: "Password has been modified"})
        
    } catch (err) {
        if(err.message === "jwt expired"){
            return res.status(400).json({message: err.message})
        }
        return res.status(500).json({message: err.message})
    }   

}

exports.refreshAuth = async (req, res) =>{
    const tokenRefresh = req.cookies.tokenRefresh
    if(!tokenRefresh)
        return res.status(404).json({message: "Token not found, please reconnect. "})
    try {
        const decoded = jwt.verify(tokenRefresh, JWT_SECRET)
        const tokenAccess = generateToken(decoded.id, 900)
        res.cookie("TokenAcess", tokenAccess,{
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            maxAge: 15*60*1000
        })
        res.status(200).json({
            message: "Access token refreshed"
        })
    } catch (err) {
        res.status(400).json({message: err.message})
    }
}