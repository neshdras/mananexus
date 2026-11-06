const db = require('../config/database')

exports.getAllGames = async () => {
    const { rows } = await db.query(
        'SELECT id_game, name_game FROM games ORDER BY id_game'
    )
    return rows
}
