const db = require('../config/database')

exports.getAll = async (date) => {
    const {rows} = await db.query(
        'SELECT * FROM tournaments WHERE date >= $1',
        [date]
    )
    return rows
}

exports.getTournamentById = async (id) => {
    const {rows} = await db.query(
        'SELECT * FROM tournaments WHERE id_tournament = $1',
        [id]
    )
    return rows[0] ||  null
}
exports.getTournamentByIdAndDate = async (id, date) => {
    const {rows} = await db.query(
        'SELECT * FROM tournaments WHERE id_tournament = $1 AND date_tournament = $2',
        [id, date]
    )
    return rows[0] || null
}

exports.duplicateTournament = async(format, date, organiser, location) => {
    const {rows} = await db.query(
        'SELECT * FROM tournaments WHERE format_tournament = $1 AND date_tournament = $2 AND organiser_tournament = $3 AND location_tournament = $4',
        [format, date, organiser, location ]
    )
    return rows[0] || null
}

exports.insertTournament = async(value) => {
    const { rows } = await db.query(
        'INSERT INTO tournaments(name_tournament, format_tournament, date_tournament, fk_id_user, price_tournament, ctc_tournament, location_tournament, description_tournament) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING name_tournament AS name, format_tournament AS format, date_tournament, price_tournament AS price, ctc_tournament AS ctc, location_tournament AS location, description_tournament AS description',
        [value]
    )
    return rows[0]
}

exports.updateTournament = async (value) => {
    await db.query(
        'UPDATE tournaments SET name_tournament = $1, format_tournament = $2, date_tournament = $3, price_tournament = $4, ctc_tournament = $5, location_tournament = $6, description_tournament = $7 WHERE id_tournament = $8',
        value
    )
    
}

exports.addPlayerToTournament = async (tournament, user) =>{
    await db.query(
        'INSERT INTO tournaments_has_players VALUES ($1, $2)',
        [tournament, user]
    )
}

exports.verifyRegister = async (tournament, user) =>{
    const {rows} = await db.query(
        'SELECT COUNT(*) FROM tournaments_has_players WHERE fk_id_tournament = $1 AND fk_id_player = $2',
        [tournament, user]
    )
    return rows[0].count
}
exports.deleteRegister = async (tournament, user) => {
    await db.query(
        'DELETE FROM tournaments_has_players WHERE fk_id_tournament = $1 AND fk_id_player = $2',
        [tournament, user]
    )
}

exports.seePlayerRegister = async(tournament) => {
    const {rows} = await db.query(
        'SELECT u.firstname_user AS firstname, u.lastname_user AS lastname, u.pseudo_user AS pseudo FROM users AS u INNER JOIN tournaments_has_players as tp ON u.id_user = tp.fk_id_player INNER JOIN tournaments AS t ON tp.fk_id_tournament = t.id_tournament WHERE t.id_tournament = $1',
        [tournament]
    )
    return rows
}