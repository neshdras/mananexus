const User = require('../model/userModel')
const validator = require('validator')
const bcrypt = require('bcryptjs')

exports.getProfile = async (req, res) => {
    const id = req.params.id
    if(!id){
        // Faire appel au model qui renvoie info user et faire un return 
        return res.status(200).json({user: req.user})
    }
    const user = User.findUserById(id)
    return res.status(200).json({user})
}
exports.updateUser = async (req, res) => {
    const user = req.user
    
    const firstname = req.body.firstname
    const lastname = req.body.lastname
    const email = req.body.email
    const password = req.body.password

    const pseudo = req.body.pseudo || null
    const picture = req.body.picture || null


    if(firstname != null)
        user.firstname_user = firstname
    if(lastname != null)
        user.lastname_user = lastname
    if(email != null){
        const validateEmail = validator.isEmail(email)
        if(!validateEmail)
            return res.status(400).json({message: 'Please provide a valid email'})

        const existingEmail = await User.findUserByEmail(email)
        if(existingEmail)
            return res.status(400).json({message: "Email already use"})

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

        const existingPseudo = await User.findUserByPseudo(pseudo)
        if(existingPseudo)
            return res.status(400).json({message: "Pseudo already exist"})

        user.pseudo_user = pseudo

    }
    if(picture != null)
        user.picture_user = picture


    await User.updateUser(user)
    res.status(200).json({message: "Profile updated !"})
}

exports.seeRanking = async (req, res) => {
    const rankingList = await User.rankingQuery()
    res.json(rankingList)
}