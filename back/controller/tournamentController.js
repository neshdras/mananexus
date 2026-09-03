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
        const { name, format, date, organizer} = req.body
        
        if(!name || !format || !date || !organizer)
            return res.status(400).json({message: 'Please provide the information ask for'})

        const insertText = 'INSERT INTO tournaments(name_tournament, format_tournament, date_tournament, fk_id_user) VALUES ($1, $2, $3, $4) RETURNING name_tournament AS name, format_tournament AS format, date_tournament'
        const insertValue = [name, format, date, organizer]
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

