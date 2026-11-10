const { getDeckByID } = require("../model/deckModel")
const { getAll, insertTournament, duplicateTournament, getTournamentById, updateTournament, verifyRegister, addPlayerToTournament, getTournamentByIdAndDate, deleteRegister, seePlayerRegister } = require("../model/tournamentModel")
const {findUserById} = require('../model/userModel')

exports.seeAll = async (req, res)=>{
    try {
        const date = new Date().toISOString()
        const today = date.split("T")[0]
        const result = await getAll(today)
        res.status(200).json({
            title: 'Tournaments retrieved',
            status: 200,
            detail: 'The tournaments were retrieved successfully',
            tournaments: result
        })
    } catch (err) {
        res.status(500).json({
            title: 'Server error',
            status: 500,
            detail: err.message
        })
    }
}

exports.createTournament = async (req, res) => {
    try {
        const { name, format, date, price, paf, location, gameId} = req.body
        const organizer = req.user.id_user

        const existingTournament = await duplicateTournament(format, date, organizer, location)
        if(existingTournament)
            return res.status(400).json({
                title: 'Bad request',
                status: 400,
                detail: 'Tournament already exist'
            })

        const insertValue = [name, format, date, organizer, price, paf, location, null, gameId]
        const tournamentInfo = await insertTournament(insertValue)
        res.status(201).json({
            title: 'Created',
            status: 201,
            detail: "Tournament creted successfully",
            tournamentInfo
        })
    } catch (err) {
        res.status(500).json({
            title: 'Server error',
            status: 500,
            detail: err.message
        })
    }
}

exports.updateTournament = async (req, res) => {
    const id = req.params.id
    const { name, format, date, price, paf, location} = req.body

    const tournament = await getTournamentById(id)

    if(tournament == null)
        return res.status(404).json({
            title: 'Not found',
            status: 404,
            detail: "Tournament not found"
        })

    if(String(tournament.fk_id_user) !== String(req.user.id_user))
        return res.status(403).json({
            title: 'Forbidden',
            status: 403,
            detail: "Only the tournament creator can update this tournament"
        })

    const uniquenessFieldsChanged = format !== undefined || date !== undefined || location !== undefined
    if(uniquenessFieldsChanged){
        const nextFormat = format !== undefined ? format : tournament.format_tournament
        const nextDate = date !== undefined ? date : tournament.date_tournament
        const nextLocation = location !== undefined ? location : tournament.location_tournament
        const existingTournament = await duplicateTournament(nextFormat, nextDate, req.user.id_user, nextLocation)
        if(existingTournament && existingTournament.id_tournament !== tournament.id_tournament)
            return res.status(400).json({
                title: 'Bad request',
                status: 400,
                detail: 'Tournament already exist'
            })
    }

    if(name !== undefined){
        tournament.name_tournament = name
    }
    if(format !== undefined){
        tournament.format_tournament = format
    }

    if(date !== undefined){
        tournament.date_tournament = date
    }

    if(price !== undefined)
        tournament.price_tournament = price
    if(paf !== undefined)
        tournament.ctc_tournament = paf
    if(location !== undefined){
        tournament.location_tournament = location   
    }



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

    await updateTournament(updateValue)
    res.status(200).json({
        title: 'Success',
        status: 200,
        detail: "Tournament update succesfully"
    })
}

exports.addPlayer = async (req, res) => {
    const idTournament = req.params.id
    const idUser = req.user.id_user
    const idDeck = req.body.idDeck
    const today = new Date().toISOString().split('T')[0]

    const queryTime = await getTournamentByIdAndDate(idTournament, today)
    if(!queryTime)
        return res.status(404).json({
            title: 'Not found',
            status: 404,
            detail: "Tournament not found"
        })
    

    const userQuery = await findUserById(idUser)
    if(!userQuery)
        return res.status(404).json({
            title: 'Not found',
            status: 404,
            detail: "User not found"
        })
    
    const deckQuery = await getDeckByID(idDeck)
    if(!deckQuery)
        return res.status(404).json({
            title: 'Not Found',
            status: 404,
            detail: "Decklist not found"
        })

    if(String(deckQuery.fk_id_user) !== String(idUser))
        return res.status(403).json({
            title: 'Forbidden',
            status: 403,
            detail: 'You can only register with your own decklist'
        })

    if(String(deckQuery.fk_id_game) !== String(queryTime.fk_id_game))
        return res.status(400).json({
            title: 'Bad request',
            status: 400,
            detail: 'Decklist game does not match tournament game'
        })
        
    const isRegister = await verifyRegister(idTournament, idUser) == 1
    if(isRegister)
        return res.status(409).json({
            title: 'Conflict',
            status: 409,
            detail: "User already register"
        })

    await addPlayerToTournament(idTournament, idUser, idDeck)
    res.status(200).json({
        title: 'Registration completed',
        status: 200,
        detail: 'Registration to tournament succesfully'
    })
}
exports.delPlayer = async (req, res) => {
    const idTournoi = req.params.id
    const idUser = req.user.id_user

    const today = new Date().toISOString().split('T')[0]

    const queryTime = await getTournamentByIdAndDate(idTournoi, today)
    if(!queryTime)
        return res.status(404).json({
            title: 'Not found',
            status: 404,
            detail: "Tournament not found"
        })
    
    const userQuery = await findUserById(idUser)
    if(!userQuery)
        return res.status(404).json({
            title: 'Not found',
            status: 404,
            detail: "User not found"
        })

    const verifyQuery = await verifyRegister(idTournoi, idUser)
    const isRegister = verifyQuery == 1
    if(!isRegister)
        return res.status(400).json({
            title: 'Bad request',
            status: 400,
            detail: "User don't register"
        })

    await deleteRegister(idTournoi, idUser)
    res.status(200).json({
        title: 'Registration cancelled',
        status: 200,
        detail: 'Unregistration to tournament succesfully'
    })
}

exports.seePlayer = async (req, res) => {
    const idTournoi = req.params.id
    const playerList = await seePlayerRegister(idTournoi)
    res.status(200).json({
        title: 'Players retrieved',
        status: 200,
        detail: 'The registered players were retrieved successfully',
        players: playerList
    })
}
