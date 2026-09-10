const db = require('../config/database')
const validator = require('validator')
const bcrypt = require('bcryptjs')

exports.getProfile = async (req, res) => {
    const user = req.user
    res.json({user})
}
exports.updateUser = async (req, res) => {
    const user = req.user
    
    const firstname = req.body.firstname
    const lastname = req.body.lastname
    const email = req.body.email
    const password = req.body.password

    const pseudo = req.body.pseudo || null
    const picture = req.body.picture || null

    const userText = 'SELECT firstname_user , lastname_user, pseudo_user, email_user, password_user, picture_user FROM users WHERE id_user = $1' 
    const queryUser = await db.query(userText, [id])
    const isUser = queryUser.rows[0].count == 1
    
    if(!isUser)
        return res.status(400).json({message: "User not found"})
    
    if(firstname != null)
        user.firstname_user = firstname
    if(lastname != null)
        user.lastname_user = lastname
    if(email != null){
        const textExisitingEmail =  'SELECT COUNT(*) FROM users WHERE email_user = $1'
        const queryExistingEmail = await db.query(textExisitingEmail, [email])
        const existingEmail = queryExistingEmail.rows[0].count == 1
        if(existingEmail)
            return res.status(400).json({message: "Email already use"})

        const validateEmail = validator.isEmail(email)
        if(!validateEmail)
            return res.status(400).json({message: 'Please provide a valid email'})

        user.email_user = email
    }
    if(password != null){
        const validatePassword = validator.isStrongPassword(password, {
            minLength: 6,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers:1,
            minSymbols:1
        })
        if(!validatePassword)
            return res.status(400).json({message: "The password need to have 1 lower, 1 upper, 1 number and 1 symbol and 6 character long min"})

        const hash = await bcrypt.hash(password, 15)
        user.password_user = hash
    }
    if(pseudo != null){
        const minLengthPseudo = validator.isByteLength(pseudo, 3)
        if(!minLengthPseudo)
            return res.status(400).json({message: "Pseudo need at least 3 characters"})

        const existingPseudoText = 'SELECT COUNT(*) FROM users WHERE pseudo_user = $1'
        const existingPseudoQuery = await db.query(existingPseudoText, [pseudo])
        const existingPseudo = existingPseudoQuery.rows[0].count == 1
        if(existingPseudo)
            return res.status(400).json({message: "Pseudo already exist"})

        user.pseudo_user = pseudo

    }
    if(picture != null)
        user.picture_user = picture

    const updateText = 'UPDATE users SET firstname_user = $1, lastname_user = $2, pseudo_user = $3, email_user = $4, password_user = $5, picture_user = $6 WHERE id_user = $7'
    const updateValue = [
        user.firstname_user,
        user.lastname_user,
        user.pseudo_user,
        user.email_user,
        user.password_user,
        user.picture_user,
        id
    ]
    await db.query(updateText, updateValue)
    res.status(200).json({message: "Profile updated !"})
}

exports.seeRanking = async (req, res) => {
    const rankingText = 'SELECT firstname_user AS firstname, lastname_user AS lastname, pseudo_user AS pseudo, victorypts_user AS victorypts FROM users ORDER BY victorypts'
    // const rankingText = 'SELECT * FROM users'
    const rankingQuery = await db.query(rankingText, [])
    const rankingList = rankingQuery.rows
    res.json(rankingList)
}