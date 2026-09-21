const { getAll, insertTournament, duplicateTournament, getTournamentById, updateTournament, verifyRegister, addPlayerToTournament, getTournamentByIdAndDate, deleteRegister, seePlayerRegister } = require("../model/tournamentModel")
const {findUserById} = require('../model/userModel')

exports.seeAll = async (req, res)=>{
    try {
        const date = new Date().toISOString()
        const today = date.split("T")[0]
        const result = getAll(today)
        res.json(result.rows[0])
    } catch (err) {
        res.status(500).json({message: err.message})
    }
}

exports.createTournament = async (req, res) => {
    try {
        const { name, format, date, price, paf, location} = req.body
        const organizer = req.user.id_user
        if(!name || !format || !date || !organizer || !price || !paf || !location)
            return res.status(400).json({message: 'Please provide the information ask for'})

        const existingTournament = await duplicateTournament(format, date, organizer, location)
        if(existingTournament)
            return res.status(400).json({message: 'Tournament already exist'})

        const insertValue = [name, format, date, organizer, price, paf, location, desc]
        const tournamentInfo = await insertTournament(insertValue)
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

    
    const tournament = await getTournamentById(id)

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
    res.status(200).json({message: "Tournament update succesfully"})
}

exports.addPlayer = async (req, res) => {
    const idTournament = req.params.id
    const idUser = req.user.id

    const date = new Date().toISOString()
    const today = date.split("T")[0]

    const queryTime = await getTournamentByIdAndDate(idTournament, today)
    if(!queryTime)
        return res.status(404).json({message: "Tournament not found"})
    

    const userQuery = await findUserById(idUser)
    if(!userQuery)
        return res.status(404).json({message: "User not found"})

    const isRegister = await verifyRegister(idTournament, idUser) == 1
    if(isRegister)
        return res.status(409).json({message: "User already register"})

    await addPlayerToTournament(idTournament, idUser)
    res.status(200).json("Registration to tournament succesfully")
}
exports.delPlayer = async (req, res) => {
    const idTournoi = req.params.id
    const idUser = req.body.id

    const date = new Date().toISOString()
    const today = date.split("T")[0]

    const queryTime = await getTournamentByIdAndDate(idTournoi, today)
    if(queryTime)
        return res.status(404).json({message: "Tournament not found"})
    
    const userQuery = await findUserById(idUser)
    if(userQuery)
        return res.status(404).json({message: "User not found"})

    const verifyQuery = await verifyRegister(idTournoi, idUser)
    const isRegister = verifyQuery == 1
    if(!isRegister)
        return res.status(400).json({message: "User don't register"})

    await deleteRegister(idTournoi, idUser)
    res.status(200).json("Unregistration to tournament succesfully")
}

exports.seePlayer = async (req, res) => {
    const idTournoi = req.params.id
    const playerList = await seePlayerRegister(idTournoi)
    res.json(playerList)
}