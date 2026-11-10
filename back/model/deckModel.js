const db = require('../config/database')

exports.insertDeck = async (userId, gameId, deck) => {
    const { rows } = await db.query(
        'WITH inserted AS (INSERT INTO decklists (fk_id_user, fk_id_game, name_decklist, format_decklist, url_decklist) VALUES ($1, $2, $3, $4, $5) RETURNING id_decklist, fk_id_user, fk_id_game, name_decklist, format_decklist, url_decklist) SELECT inserted.*, games.name_game FROM inserted INNER JOIN games ON games.id_game = inserted.fk_id_game',
        [userId, gameId, deck.name, deck.format, deck.url]
    )
    return rows[0]
}

exports.getDeckByID = async (deckId) => {
    const { rows } = await db.query(
        'SELECT * FROM decklists WHERE id_decklist = $1',
        [deckId]
    )
    return rows[0]
}

exports.getDecksByUserAndGame = async (userId, gameId) => {
    const { rows } = await db.query(
        'SELECT d.id_decklist, d.fk_id_game, g.name_game, d.name_decklist, d.format_decklist, d.url_decklist FROM decklists AS d INNER JOIN games AS g ON g.id_game = d.fk_id_game WHERE d.fk_id_user = $1 AND d.fk_id_game = $2 ORDER BY d.name_decklist',
        [userId, gameId]
    )
    return rows
}

exports.getDecksByUser = async (userId) => {
    const { rows } = await db.query(
        'SELECT d.id_decklist, d.fk_id_game, g.name_game, d.name_decklist, d.format_decklist, d.url_decklist FROM decklists AS d INNER JOIN games AS g ON g.id_game = d.fk_id_game WHERE d.fk_id_user = $1 ORDER BY g.name_game, d.name_decklist',
        [userId]
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
