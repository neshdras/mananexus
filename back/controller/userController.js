const User = require('../model/userModel')
const validator = require('validator')
const bcrypt = require('bcryptjs')

exports.getProfile = async (req, res) => {
    const id = req.params.id
    if(!id){
        // Faire appel au model qui renvoie info user et faire un return 
        return res.status(200).json({
            title: 'Profile retrieved',
            status: 200,
            detail: 'The connected user profile was retrieved successfully',
            user: req.user
        })
    }
    const user = await User.findUserById(id)
    return res.status(200).json({
        title: 'Profile retrieved',
        status: 200,
        detail: 'The requested user profile was retrieved successfully',
        user
    })
}
exports.updateUser = async (req, res) => {
    const user = req.user
    
    const firstname = req.body.firstname
    const lastname = req.body.lastname
    const email = req.body.email
    const password = req.body.password

    const pseudo = req.body.pseudo
    const picture = req.body.picture


    if(firstname !== undefined)
        user.firstname_user = firstname
    if(lastname !== undefined)
        user.lastname_user = lastname
    if(email !== undefined){
        const validateEmail = validator.isEmail(email)
        if(!validateEmail)
            return res.status(400).json({
                title: 'Bad request',
                status: 400,
                detail: 'Please provide a valid email'
            })

        const existingEmail = await User.findUserByEmail(email)
        if(existingEmail)
            return res.status(400).json({
                title: 'Bad request',
                status: 400,
                detail: "Email already use"
            })

        user.email_user = email
    }
    if(password !== undefined){
        const validatePassword = validator.isStrongPassword(password, {
            minLength: 6,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers:1,
            minSymbols:1
        })
        if(!validatePassword)
            return res.status(400).json({
                title: 'Bad request',
                status: 400,
                detail: "The password need to have 1 lower, 1 upper, 1 number and 1 symbol and 6 character long min"
            })

        const hash = await bcrypt.hash(password, 15)
        user.password_user = hash
    }
    if(pseudo !== undefined){
        const minLengthPseudo = validator.isByteLength(pseudo, 3)
        if(!minLengthPseudo)
            return res.status(400).json({
                title: 'Bad request',
                status: 400,
                detail: "Pseudo need at least 3 characters"
            })

        const existingPseudo = await User.findUserByPseudo(pseudo)
        if(existingPseudo)
            return res.status(400).json({
                title: 'Bad request',
                status: 400,
                detail: "Pseudo already exist"
            })

        user.pseudo_user = pseudo

    }
    if(picture !== undefined)
        user.picture_user = picture


    await User.updateUser(user)
    res.status(200).json({
        title: 'Success',
        status: 200,
        detail: "Profile updated !"
    })
}

exports.seeRanking = async (req, res) => {
    const rankingList = await User.rankingQuery()
    res.status(200).json({
        title: 'Ranking retrieved',
        status: 200,
        detail: 'The ranking was retrieved successfully',
        ranking: rankingList
    })
}