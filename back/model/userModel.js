const db = require('../config/database')

exports.createUser = async (user) => {
    
    const { rows } = await db.query(
        'INSERT INTO users(firstname_user, lastname_user, pseudo_user, email_user, password_user, picture_user) VALUES($1, $2, $3, $4, $5, $6) RETURNING id_user, firstname_user, lastname_user, pseudo_user, email_user, picture_user',
        [user]
    )

    return rows[0];
}

exports.findUserByEmail = async (email) => {  
    const { rows } = await db.query(
        `SELECT * FROM users WHERE email_user = $1`,
        [email.toLowerCase().trim()]
    )

    return rows[0] || null;
}

exports.findUserByPseudo = async (pseudo) => {
    const { rows } = await db.query(
        'SELECT * FROM users WHERE pseudo_user = $1',
        [pseudo]
    )
    return rows[0] || null
}

exports.findUserById = async (id) => {
    const { rows } = await db.query(
        `SELECT * FROM users WHERE id_user = $1`,
        [id]
    )

    return rows[0] || null;
}
exports.updateUser = async (user) =>{
    const updateText = 'UPDATE users SET firstname_user = $1, lastname_user = $2, pseudo_user = $3, email_user = $4, password_user = $5, picture_user = $6 WHERE id_user = $7 RETURNING *'
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
}

exports.rankingQuery = async () => {
    const rankingText = 'SELECT firstname_user AS firstname, lastname_user AS lastname, pseudo_user AS pseudo, victorypts_user AS victorypts FROM users ORDER BY victorypts'
    const {rows} = await db.query(rankingText, [])
    return rows 
}

exports.resetToken = async(token) => {
    await db.query(
        'UPDATE users SET token_password_forget = $1 WHERE id_user = $2',
        [token]
    ) 
}

exports.verifyToken = async(token, id) => {
    const {rows} = await db.query(
        'SELECT COUNT(*) FROM users WHERE token_password_forget = $1 AND id_user = $2',
        [token, id]
    )
    return rows[0].count
}

exports.udpatePassword = async (password, id) => {
    await db.query(
        'UPDATE users SET password_user = $1, token_password_forget = null WHERE id_user = $2',
        [password, id]
    )
}