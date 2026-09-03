const db = require('../config/database')

exports.seeAll = async (req, res)=>{
    try {
        const text = 'SELECT * FROM tournaments'
        const result = await db.query(text) 
        console.log(result)
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

