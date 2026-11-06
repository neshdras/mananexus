const { getAllGames } = require('../model/gameModel')

exports.seeAll = async (req, res) => {
    try {
        const games = await getAllGames()
        return res.status(200).json({
            title: 'Games retrieved',
            status: 200,
            detail: 'The games were retrieved successfully',
            games,
        })
    } catch (err) {
        return res.status(500).json({
            title: 'Server error',
            status: 500,
            detail: err.message,
        })
    }
}
