const db = require('../config/database')

exports.seeAll = async (req, res)=>{
    try {
        const text = 'SELECT * FROM tournaments WHERE date >= :dateNow'
        const result = await db.query(text) 
        
        res.json(result.rows[0])
    } catch (err) {
        res.status(500).json({message: err.message})
    }
}

exports.createTournament = async (req, res) => {
    try {
        const { name, format, date, organizer, price, paf, location} = req.body
        const desc = req.body.description
        if(!name || !format || !date || !organizer || !price || !paf || !location)
            return res.status(400).json({message: 'Please provide the information ask for'})

        const insertText = 'INSERT INTO tournaments(name_tournament, format_tournament, date_tournament, fk_id_user, price_tournament, ctc_tournament, location_tournament, description_tournament) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING name_tournament AS name, format_tournament AS format, date_tournament, price_tournament AS price, ctc_tournament AS ctc, location_tournament AS location, description_tournament AS description'
        const insertValue = [name, format, date, organizer, price, paf, location, desc]
        const insertQuery = await db.query(insertText, insertValue)
        const tournamentInfo = insertQuery.rows[0]
        res.status(201).json({
            message: "Tournament creted successfully",
            tournamentInfo
        })
    } catch (err) {
        res.status(500).json({message: err.message})
    }
}

exports.updateTournament = async (req, res) => {
    const id = req.params.id
    const { name, format, date, price, paf, location} = req.body
    const desc = req.body.description 
    
    const existingText = 'SELECT * FROM tournaments WHERE id_tournament = $1 GROUP BY id_tournament'
    const existingValue = [id]
    const existingQuery = await db.query(existingText, existingValue)
    const tournament = existingQuery.rows[0]
    if(tournament == null)
        return res.status(404).json({message: "Tournament not found"})

    if(name != null)
        tournament.name_tournament = name
    if(format != null)
        tournament.format_tournament = format
    if(date != null)
        tournament.date_tournament = date

    if(price != null)
        tournament.price_tournament = price
    if(paf != null)
        tournament.ctc_tournament = paf
    if(location != null)
        tournament.location_tournament = location   
    if(desc != null)
        tournament.description_tournament = desc

    const updateText = 'UPDATE tournaments SET name_tournament = $1, format_tournament = $2, date_tournament = $3, price_tournament = $4, ctc_tournament = $5, location_tournament = $6, description_tournament = $7 WHERE id_tournament = $8'
    const updateValue = [
        tournament.name_tournament,
        tournament.format_tournament,
        tournament.date_tournament,
        tournament.price_tournament,
        tournament.ctc_tournament,
        tournament.location_tournament,
        tournament.description_tournament,
        id
    ]

    await db.query(updateText, updateValue) 
    res.status(200).json({message: "Tournament update succesfully"})
}

exports.addPlayer = async (req, res) => {
    const idTournoi = req.params.id
    const idUser = req.body.id

    const date = new Date().toISOString()
    const today = date.split("T")[0]

    const textTime = 'SELECT COUNT(*) FROM tournaments WHERE date_tournament >= $1 AND id_tournament = $2'
    const queryTime = await db.query(textTime, [today, idTournoi])
    if(queryTime.rows[0].count != 1)
        return res.status(404).json({message: "Tournament not found"})
    
    const textUser = 'SELECT COUNT(*) FROM users WHERE id_user = $1'
    const userQuery = await db.query(textUser, [idUser])
    if(userQuery.rows[0].count != 1)
        return res.status(404).json({message: "User not found"})

    const verifyText = 'SELECT COUNT(*) FROM tournaments_has_players WHERE fk_id_tournament = $1 AND fk_id_player = $2'
    const verifyValue = [idTournoi, idUser]

    const verifyQuery = await db.query(verifyText, verifyValue)
    const isRegister = verifyQuery.rows[0].count == 1
    if(isRegister)
        return res.status(409).json({message: "User already register"})

    const textInsert = 'INSERT INTO tournaments_has_players VALUES ($1, $2)'
    const valuInsert = [idTournoi, idUser]
    await db.query(textInsert, valuInsert)
    res.status(200).json("Registration to tournament succesfully")
}
exports.delPlayer = async (req, res) => {
    const idTournoi = req.params.id
    const idUser = req.body.id

    const date = new Date().toISOString()
    const today = date.split("T")[0]

    const textTime = 'SELECT COUNT(*) FROM tournaments WHERE date_tournament >= $1 AND id_tournament = $2'
    const queryTime = await db.query(textTime, [today, idTournoi])
    if(queryTime.rows[0].count != 1)
        return res.status(404).json({message: "Tournament not found"})
    
    const textUser = 'SELECT COUNT(*) FROM users WHERE id_user = $1'
    const userQuery = await db.query(textUser, [idUser])
    if(userQuery.rows[0].count != 1)
        return res.status(404).json({message: "User not found"})

    const verifyText = 'SELECT COUNT(*) FROM tournaments_has_players WHERE fk_id_tournament = $1 AND fk_id_player = $2'
    const verifyValue = [idTournoi, idUser]

    const verifyQuery = await db.query(verifyText, verifyValue)
    const isRegister = verifyQuery.rows[0].count == 1
    if(!isRegister)
        return res.status(400).json({message: "User don't register"})

    const textDelete = 'DELETE FROM tournaments_has_players WHERE fk_id_tournament = $1 AND fk_id_player = $2'
    
    await db.query(textDelete, valuInsert)
    res.status(200).json("Unregistration to tournament succesfully")
}

exports.seePlayer = async (req, res) => {
    const idTournoi = req.params.id

    const textSelect = 'SELECT u.firstname_user AS firstname, u.lastname_user AS lastname, u.pseudo_user AS pseudo FROM users AS u INNER JOIN tournaments_has_players as tp ON u.id_user = tp.fk_id_player INNER JOIN tournaments AS t ON tp.fk_id_tournament = t.id_tournament WHERE t.id_tournament = $1'
    const querySelect = await db.query(textSelect, [idTournoi])
    res.json(querySelect.rows)
}