const { insertDeck, getDecksByUserAndGame, deleteDeckByIdAndUser } = require('../model/deckModel')

const getGameId = (value) => {
    const gameId = Number(value)
    return Number.isInteger(gameId) && gameId > 0 ? gameId : null
}

const getDeckId = (value) => {
    const deckId = Number(value)
    return Number.isInteger(deckId) && deckId > 0 ? deckId : null
}

exports.addDeck = async (req, res) => {
    const gameId = getGameId(req.params.gameId)
    if (!gameId)
        return res.status(400).json({
            title: 'Bad request',
            status: 400,
            detail: 'Invalid game id'
        })

    try {
        const deck = await insertDeck(req.user.id_user, gameId, req.body)
        return res.status(201).json({
            title: 'Created',
            status: 201,
            detail: 'Decklist created successfully',
            deck
        })
    } catch (err) {
        return res.status(500).json({
            title: 'Server error',
            status: 500,
            detail: err.message
        })
    }
}

exports.seeMyDecks = async (req, res) => {
    const gameId = getGameId(req.params.gameId)
    if (!gameId)
        return res.status(400).json({
            title: 'Bad request',
            status: 400,
            detail: 'Invalid game id'
        })

    try {
        const decks = await getDecksByUserAndGame(req.user.id_user, gameId)
        return res.status(200).json({
            title: 'Decklists retrieved',
            status: 200,
            detail: 'The connected user decklists were retrieved successfully',
            decks
        })
    } catch (err) {
        return res.status(500).json({
            title: 'Server error',
            status: 500,
            detail: err.message
        })
    }
}

exports.deleteDeck = async (req, res) => {
    const deckId = getDeckId(req.params.id)
    if (!deckId)
        return res.status(400).json({
            title: 'Bad request',
            status: 400,
            detail: 'Invalid decklist id'
        })

    try {
        const deck = await deleteDeckByIdAndUser(deckId, req.user.id_user)
        if (!deck)
            return res.status(404).json({
                title: 'Not found',
                status: 404,
                detail: 'Decklist not found'
            })

        return res.status(200).json({
            title: 'Deleted',
            status: 200,
            detail: 'Decklist deleted successfully',
            deck
        })
    } catch (err) {
        return res.status(500).json({
            title: 'Server error',
            status: 500,
            detail: err.message
        })
    }
}
