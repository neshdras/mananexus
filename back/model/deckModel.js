const db = require('../config/database')

exports.insertDeck = async (userId, gameId, deck) => {
    const { rows } = await db.query(
        'INSERT INTO decklists (fk_id_user, fk_id_game, name_decklist, format_decklist, url_decklist) VALUES ($1, $2, $3, $4, $5) RETURNING id_decklist, fk_id_user, fk_id_game, name_decklist, format_decklist, url_decklist',
        [userId, gameId, deck.name, deck.format, deck.url]
    )
    return rows[0]
}

exports.getDecksByUserAndGame = async (userId, gameId) => {
    const { rows } = await db.query(
        'SELECT id_decklist, fk_id_user, fk_id_game, name_decklist, format_decklist, url_decklist FROM decklists WHERE fk_id_user = $1 AND fk_id_game = $2 ORDER BY name_decklist',
        [userId, gameId]
    )
    return rows
}

exports.deleteDeckByIdAndUser = async (deckId, userId) => {
    const { rows } = await db.query(
        'DELETE FROM decklists WHERE id_decklist = $1 AND fk_id_user = $2 RETURNING id_decklist, fk_id_user, fk_id_game, name_decklist, format_decklist, url_decklist',
        [deckId, userId]
    )
    return rows[0] || null
}
