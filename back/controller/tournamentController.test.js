jest.mock('../config/database', () => ({ query: jest.fn() }))
const db = require('../config/database')
const { seeAll, createTournament, updateTournament, addPlayer, delPlayer, seePlayer } = require('./tournamentController')

describe('Tournament Controller', () => {
    let req, res, tournament
    beforeEach(() => {
        jest.resetAllMocks()
        jest.useFakeTimers().setSystemTime(new Date('2030-11-15T12:00:00Z'))
        req = {
            params: { id: '7' }, user: { id_user: 1 },
            body: { gameId: 3, idDeck: 9, name: 'Tournoi du samedi', format: 'Commander', date: '2030-11-15T14:00:00Z', price: 'Deux boosters', paf: 5, location: 'Paris' }
        }
        res = { status: jest.fn().mockReturnThis(), json: jest.fn() }
        tournament = { id_tournament: 7, fk_id_user: 1, fk_id_game: 3, name_tournament: 'Ancien nom', format_tournament: 'Commander', date_tournament: '2030-11-15T14:00:00Z', price_tournament: 'Deux boosters', ctc_tournament: 5, location_tournament: 'Paris', description_tournament: 'Description conservée' }
    })
    afterEach(() => { jest.useRealTimers() })

    describe('seeAll', () => {
        it('should await and return all upcoming tournaments', async () => {
            const tournaments = [tournament, { ...tournament, id_tournament: 8 }]
            db.query.mockResolvedValueOnce({ rows: tournaments })
            await seeAll(req, res)
            expect(db.query).toHaveBeenCalledWith('SELECT * FROM tournaments WHERE date_tournament >= $1', ['2030-11-15'])
            expect(res.json).toHaveBeenCalledWith({ title: 'Tournaments retrieved', status: 200, detail: 'The tournaments were retrieved successfully', tournaments: tournaments })
            expect(res.status).toHaveBeenCalledWith(200)
        })
        it('should return an empty list when there are no tournaments', async () => {
            db.query.mockResolvedValueOnce({ rows: [] })
            await seeAll(req, res)
            expect(res.json).toHaveBeenCalledWith({ title: 'Tournaments retrieved', status: 200, detail: 'The tournaments were retrieved successfully', tournaments: [] })
        })
        it('should return 500 on database failure', async () => {
            db.query.mockRejectedValueOnce(new Error('Database unavailable'))
            await seeAll(req, res)
            expect(res.status).toHaveBeenCalledWith(500)
            expect(res.json).toHaveBeenCalledWith({ title: 'Server error', status: 500, detail: 'Database unavailable' })
        })
    })

    describe('createTournament', () => {
        it('should create a tournament for the connected organizer', async () => {
            const tournamentInfo = { name: req.body.name, format: 'Commander', date_tournament: req.body.date, price: 'Deux boosters', ctc: 5, location: 'Paris', description: null, fk_id_game: 3 }
            db.query.mockResolvedValueOnce({ rows: [] }).mockResolvedValueOnce({ rows: [tournamentInfo] })
            await createTournament(req, res)
            expect(db.query).toHaveBeenNthCalledWith(1, expect.stringContaining('fk_id_user = $3'), ['Commander', req.body.date, 1, 'Paris'])
            expect(db.query).toHaveBeenNthCalledWith(2, expect.stringContaining('INSERT INTO tournaments'), [req.body.name, 'Commander', req.body.date, 1, 'Deux boosters', 5, 'Paris', null, 3])
            expect(res.status).toHaveBeenCalledWith(201)
            expect(res.json).toHaveBeenCalledWith({ title: 'Created', status: 201, detail: 'Tournament creted successfully', tournamentInfo })
        })
        it('should reject a duplicate tournament', async () => {
            db.query.mockResolvedValueOnce({ rows: [tournament] })
            await createTournament(req, res)
            expect(res.status).toHaveBeenCalledWith(400)
            expect(res.json).toHaveBeenCalledWith({ title: 'Bad request', status: 400, detail: 'Tournament already exist' })
            expect(db.query).toHaveBeenCalledTimes(1)
        })
        it('should return 500 if insertion fails', async () => {
            db.query.mockResolvedValueOnce({ rows: [] }).mockRejectedValueOnce(new Error('Insert failed'))
            await createTournament(req, res)
            expect(res.status).toHaveBeenCalledWith(500)
            expect(res.json).toHaveBeenCalledWith({ title: 'Server error', status: 500, detail: 'Insert failed' })
        })
    })

    describe('updateTournament', () => {
        it('should return 404 if tournament is missing', async () => {
            db.query.mockResolvedValueOnce({ rows: [] })
            await updateTournament(req, res)
            expect(res.status).toHaveBeenCalledWith(404)
            expect(res.json).toHaveBeenCalledWith({ title: 'Not found', status: 404, detail: 'Tournament not found' })
            expect(db.query).toHaveBeenCalledTimes(1)
        })
        it('should return 403 when the connected user is not the creator', async () => {
            db.query.mockResolvedValueOnce({ rows: [{ ...tournament, fk_id_user: 2 }] })

            await updateTournament(req, res)

            expect(res.status).toHaveBeenCalledWith(403)
            expect(res.json).toHaveBeenCalledWith({
                title: 'Forbidden',
                status: 403,
                detail: 'Only the tournament creator can update this tournament'
            })
            expect(db.query).toHaveBeenCalledTimes(1)
        })
        it('should update all supplied fields', async () => {
            req.body = { name: 'Nouveau nom', format: 'Standard', date: '2030-12-01T10:00:00Z', price: 'Trois boosters', paf: 10, location: 'Lyon' }
            db.query.mockResolvedValueOnce({ rows: [tournament] }).mockResolvedValueOnce({ rows: [] }).mockResolvedValueOnce({ rows: [] })
            await updateTournament(req, res)
            expect(db.query).toHaveBeenNthCalledWith(1, expect.stringContaining('id_tournament = $1'), ['7'])
            expect(db.query).toHaveBeenNthCalledWith(2, expect.stringContaining('fk_id_user = $3'), ['Standard', req.body.date, 1, 'Lyon'])
            expect(db.query).toHaveBeenNthCalledWith(3, expect.stringContaining('UPDATE tournaments'), ['Nouveau nom', 'Standard', req.body.date, 'Trois boosters', 10, 'Lyon', 'Description conservée', '7'])
            expect(res.status).toHaveBeenCalledWith(200)
            expect(res.json).toHaveBeenCalledWith({ title: 'Success', status: 200, detail: 'Tournament update succesfully' })
        })
        it.each([
            ['name', { name: 'Nouveau nom' }, ['Nouveau nom', 'Commander', '2030-11-15T14:00:00Z', 'Deux boosters', 5, 'Paris', 'Description conservée', '7'], false],
            ['format', { format: 'Standard' }, ['Ancien nom', 'Standard', '2030-11-15T14:00:00Z', 'Deux boosters', 5, 'Paris', 'Description conservée', '7'], true],
            ['date', { date: '2030-12-01T10:00:00Z' }, ['Ancien nom', 'Commander', '2030-12-01T10:00:00Z', 'Deux boosters', 5, 'Paris', 'Description conservée', '7'], true],
            ['price', { price: 'Trois boosters' }, ['Ancien nom', 'Commander', '2030-11-15T14:00:00Z', 'Trois boosters', 5, 'Paris', 'Description conservée', '7'], false],
            ['paf', { paf: 10 }, ['Ancien nom', 'Commander', '2030-11-15T14:00:00Z', 'Deux boosters', 10, 'Paris', 'Description conservée', '7'], false],
            ['location', { location: 'Lyon' }, ['Ancien nom', 'Commander', '2030-11-15T14:00:00Z', 'Deux boosters', 5, 'Lyon', 'Description conservée', '7'], true]
        ])('should update only %s and preserve the other fields', async (field, body, updateValues, checksDuplicates) => {
            req.body = body
            db.query.mockResolvedValueOnce({ rows: [tournament] })
            if(checksDuplicates)
                db.query.mockResolvedValueOnce({ rows: [] })
            db.query.mockResolvedValueOnce({ rows: [] })

            await updateTournament(req, res)

            expect(db.query).toHaveBeenCalledTimes(checksDuplicates ? 3 : 2)
            if(checksDuplicates){
                const expectedFormat = body.format ?? tournament.format_tournament
                const expectedDate = body.date ?? tournament.date_tournament
                const expectedLocation = body.location ?? tournament.location_tournament
                expect(db.query).toHaveBeenNthCalledWith(2, expect.stringContaining('fk_id_user = $3'), [expectedFormat, expectedDate, 1, expectedLocation])
            }
            expect(db.query).toHaveBeenNthCalledWith(checksDuplicates ? 3 : 2, expect.stringContaining('UPDATE tournaments'), updateValues)
            expect(res.status).toHaveBeenCalledWith(200)
            expect(res.json).toHaveBeenCalledWith({ title: 'Success', status: 200, detail: 'Tournament update succesfully' })
        })

        it('should preserve every field when the request body is empty', async () => {
            req.body = {}
            db.query.mockResolvedValueOnce({ rows: [tournament] }).mockResolvedValueOnce({ rows: [] })
            await updateTournament(req, res)
            expect(db.query).toHaveBeenCalledTimes(2)
            expect(db.query).toHaveBeenNthCalledWith(2, expect.stringContaining('UPDATE tournaments'), ['Ancien nom', 'Commander', '2030-11-15T14:00:00Z', 'Deux boosters', 5, 'Paris', 'Description conservée', '7'])
            expect(res.status).toHaveBeenCalledWith(200)
        })

        it.each([
            ['format', { format: 'Standard' }],
            ['date', { date: '2030-12-01T10:00:00Z' }],
            ['location', { location: 'Lyon' }]
        ])('should reject a duplicate when %s changes', async (field, body) => {
            req.body = body
            db.query.mockResolvedValueOnce({ rows: [tournament] }).mockResolvedValueOnce({ rows: [{ ...tournament, id_tournament: 8 }] })

            await updateTournament(req, res)

            expect(db.query).toHaveBeenCalledTimes(2)
            expect(res.status).toHaveBeenCalledWith(400)
            expect(res.json).toHaveBeenCalledWith({ title: 'Bad request', status: 400, detail: 'Tournament already exist' })
        })

        it('should allow the current tournament returned by the duplicate lookup', async () => {
            req.body = { format: 'Commander' }
            db.query.mockResolvedValueOnce({ rows: [tournament] }).mockResolvedValueOnce({ rows: [tournament] }).mockResolvedValueOnce({ rows: [] })

            await updateTournament(req, res)

            expect(db.query).toHaveBeenCalledTimes(3)
            expect(db.query).toHaveBeenNthCalledWith(3, expect.stringContaining('UPDATE tournaments'), ['Ancien nom', 'Commander', '2030-11-15T14:00:00Z', 'Deux boosters', 5, 'Paris', 'Description conservée', '7'])
            expect(res.status).toHaveBeenCalledWith(200)
        })

        it('should propagate a duplicate lookup failure', async () => {
            req.body = { format: 'Standard' }
            db.query.mockResolvedValueOnce({ rows: [tournament] }).mockRejectedValueOnce(new Error('Duplicate lookup failed'))

            await expect(updateTournament(req, res)).rejects.toThrow('Duplicate lookup failed')
            expect(res.json).not.toHaveBeenCalled()
        })

        it('should propagate an update failure', async () => {
            req.body = { name: 'Nouveau nom' }
            db.query.mockResolvedValueOnce({ rows: [tournament] }).mockRejectedValueOnce(new Error('Update failed'))

            await expect(updateTournament(req, res)).rejects.toThrow('Update failed')
            expect(res.json).not.toHaveBeenCalled()
        })
    })

    describe('addPlayer', () => {
        it('should register the connected user', async () => {
            db.query.mockResolvedValueOnce({ rows: [tournament] })
                .mockResolvedValueOnce({ rows: [req.user] })
                .mockResolvedValueOnce({ rows: [{ id_decklist: 9, fk_id_user: 1, fk_id_game: 3 }] })
                .mockResolvedValueOnce({ rows: [{ count: '0' }] })
                .mockResolvedValueOnce({ rows: [] })
            await addPlayer(req, res)
            expect(db.query).toHaveBeenNthCalledWith(1, expect.stringContaining('date_tournament >= $2::date'), ['7', '2030-11-15'])
            expect(db.query).toHaveBeenNthCalledWith(2, expect.stringContaining('id_user = $1'), [1])
            expect(db.query).toHaveBeenNthCalledWith(3, expect.stringContaining('id_decklist = $1'), [9])
            expect(db.query).toHaveBeenNthCalledWith(4, expect.stringContaining('SELECT COUNT'), ['7', 1])
            expect(db.query).toHaveBeenNthCalledWith(5, expect.stringContaining('INSERT INTO tournaments_has_players'), ['7', 1, 9])
            expect(res.status).toHaveBeenCalledWith(200)
            expect(res.json).toHaveBeenCalledWith({ title: 'Registration completed', status: 200, detail: 'Registration to tournament succesfully' })
        })
        it('should return 404 if tournament is unavailable', async () => {
            db.query.mockResolvedValueOnce({ rows: [] })
            await addPlayer(req, res)
            expect(res.status).toHaveBeenCalledWith(404)
            expect(res.json).toHaveBeenCalledWith({ title: 'Not found', status: 404, detail: 'Tournament not found' })
            expect(db.query).toHaveBeenCalledTimes(1)
        })
        it('should return 404 if user is missing', async () => {
            db.query.mockResolvedValueOnce({ rows: [tournament] }).mockResolvedValueOnce({ rows: [] })
            await addPlayer(req, res)
            expect(res.status).toHaveBeenCalledWith(404)
            expect(res.json).toHaveBeenCalledWith({ title: 'Not found', status: 404, detail: 'User not found' })
            expect(db.query).toHaveBeenCalledTimes(2)
        })
        it('should return 404 if the selected decklist does not exist', async () => {
            db.query.mockResolvedValueOnce({ rows: [tournament] })
                .mockResolvedValueOnce({ rows: [req.user] })
                .mockResolvedValueOnce({ rows: [] })

            await addPlayer(req, res)

            expect(res.status).toHaveBeenCalledWith(404)
            expect(res.json).toHaveBeenCalledWith({ title: 'Not Found', status: 404, detail: 'Decklist not found' })
            expect(db.query).toHaveBeenCalledTimes(3)
        })
        it('should reject a decklist owned by another user', async () => {
            db.query.mockResolvedValueOnce({ rows: [tournament] })
                .mockResolvedValueOnce({ rows: [req.user] })
                .mockResolvedValueOnce({ rows: [{ id_decklist: 9, fk_id_user: 2, fk_id_game: 3 }] })

            await addPlayer(req, res)

            expect(res.status).toHaveBeenCalledWith(403)
            expect(res.json).toHaveBeenCalledWith({
                title: 'Forbidden',
                status: 403,
                detail: 'You can only register with your own decklist',
            })
            expect(db.query).toHaveBeenCalledTimes(3)
        })
        it('should reject a decklist for a different game', async () => {
            db.query.mockResolvedValueOnce({ rows: [tournament] })
                .mockResolvedValueOnce({ rows: [req.user] })
                .mockResolvedValueOnce({ rows: [{ id_decklist: 9, fk_id_user: 1, fk_id_game: 4 }] })

            await addPlayer(req, res)

            expect(res.status).toHaveBeenCalledWith(400)
            expect(res.json).toHaveBeenCalledWith({
                title: 'Bad request',
                status: 400,
                detail: 'Decklist game does not match tournament game',
            })
            expect(db.query).toHaveBeenCalledTimes(3)
        })
        it('should return 409 if user is already registered', async () => {
            db.query.mockResolvedValueOnce({ rows: [tournament] })
                .mockResolvedValueOnce({ rows: [req.user] })
                .mockResolvedValueOnce({ rows: [{ id_decklist: 9, fk_id_user: 1, fk_id_game: 3 }] })
                .mockResolvedValueOnce({ rows: [{ count: '1' }] })
            await addPlayer(req, res)
            expect(res.status).toHaveBeenCalledWith(409)
            expect(res.json).toHaveBeenCalledWith({ title: 'Conflict', status: 409, detail: 'User already register' })
            expect(db.query).toHaveBeenCalledTimes(4)
        })
    })

    describe('delPlayer', () => {
        it('should unregister an existing player', async () => {
            db.query.mockResolvedValueOnce({ rows: [tournament] }).mockResolvedValueOnce({ rows: [req.user] }).mockResolvedValueOnce({ rows: [{ count: '1' }] }).mockResolvedValueOnce({ rows: [] })
            await delPlayer(req, res)
            expect(db.query).toHaveBeenNthCalledWith(1, expect.stringContaining('date_tournament >= $2::date'), ['7', '2030-11-15'])
            expect(db.query).toHaveBeenNthCalledWith(2, expect.stringContaining('id_user = $1'), [1])
            expect(db.query).toHaveBeenNthCalledWith(4, expect.stringContaining('DELETE FROM tournaments_has_players'), ['7', 1])
            expect(res.status).toHaveBeenCalledWith(200)
            expect(res.json).toHaveBeenCalledWith({ title: 'Registration cancelled', status: 200, detail: 'Unregistration to tournament succesfully' })
        })
        it('should return 404 if tournament is unavailable', async () => {
            db.query.mockResolvedValueOnce({ rows: [] })
            await delPlayer(req, res)
            expect(res.status).toHaveBeenCalledWith(404)
            expect(res.json).toHaveBeenCalledWith({ title: 'Not found', status: 404, detail: 'Tournament not found' })
            expect(db.query).toHaveBeenCalledTimes(1)
        })
        it('should return 404 if user is missing', async () => {
            db.query.mockResolvedValueOnce({ rows: [tournament] }).mockResolvedValueOnce({ rows: [] })
            await delPlayer(req, res)
            expect(res.status).toHaveBeenCalledWith(404)
            expect(res.json).toHaveBeenCalledWith({ title: 'Not found', status: 404, detail: 'User not found' })
            expect(db.query).toHaveBeenCalledTimes(2)
        })
        it('should return 400 if user is not registered', async () => {
            db.query.mockResolvedValueOnce({ rows: [tournament] }).mockResolvedValueOnce({ rows: [req.user] }).mockResolvedValueOnce({ rows: [{ count: '0' }] })
            await delPlayer(req, res)
            expect(res.status).toHaveBeenCalledWith(400)
            expect(res.json).toHaveBeenCalledWith({ title: 'Bad request', status: 400, detail: "User don't register" })
            expect(db.query).toHaveBeenCalledTimes(3)
        })
    })

    describe('seePlayer', () => {
        it('should return registered players', async () => {
            const players = [{ firstname: 'Clark', lastname: 'Kent', pseudo: 'Superman' }]
            db.query.mockResolvedValueOnce({ rows: players })
            await seePlayer(req, res)
            expect(db.query).toHaveBeenCalledWith(expect.stringContaining('WHERE t.id_tournament = $1'), ['7'])
            expect(res.json).toHaveBeenCalledWith({ title: 'Players retrieved', status: 200, detail: 'The registered players were retrieved successfully', players: players })
        })
        it('should return an empty list when no player is registered', async () => {
            db.query.mockResolvedValueOnce({ rows: [] })
            await seePlayer(req, res)
            expect(res.json).toHaveBeenCalledWith({ title: 'Players retrieved', status: 200, detail: 'The registered players were retrieved successfully', players: [] })
        })
    })

    it.each([updateTournament, addPlayer, delPlayer, seePlayer])('should propagate database errors from %p', async controller => {
        db.query.mockRejectedValueOnce(new Error('Database unavailable'))
        await expect(controller(req, res)).rejects.toThrow('Database unavailable')
        expect(res.json).not.toHaveBeenCalled()
    })
})
