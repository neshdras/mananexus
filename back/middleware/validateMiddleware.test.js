const validate = require('./validateMiddleware')
const { registerSchema, updateSchema } = require('../schemas/userSchema')
const { loginSchema, sendTokenSchema, resetPasswordSchema } = require('../schemas/authSchema')
const { createTournamentSchema, updateTournamentSchema } = require('../schemas/tournamentSchema')

describe('Validate Middleware', () => {
    let req, res, next, user, tournament
    beforeEach(() => {
        jest.useFakeTimers().setSystemTime(new Date('2030-11-15T12:00:00Z'))
        user = { firstname: 'Clark', lastname: 'Kent', pseudo: 'Superman', email: 'test@mail.com', password: 'Pass1234!' }
        tournament = { name: 'Tournoi', format: 'Commander', date: '2030-12-01T14:00:00Z', price: 'Deux boosters', paf: 5, location: 'Paris' }
        req = { body: {} }
        res = { status: jest.fn().mockReturnThis(), json: jest.fn() }
        next = jest.fn()
    })
    afterEach(() => { jest.useRealTimers() })

    describe('register validation', () => {
        it.each([
            ['password', undefined], ['password', 'pass1'], ['email', 'invalid'],
            ['pseudo', '12'], ['firstname', undefined], ['lastname', undefined], ['pseudo', undefined]
        ])('should return 422 for invalid %s (%s)', (field, value) => {
            req.body = { ...user, [field]: value }
            validate(registerSchema)(req, res, next)
            expect(res.status).toHaveBeenCalledWith(422)
            expect(res.json).toHaveBeenCalledWith({ title: 'Data invalid', status: 422, invalidParams: expect.arrayContaining([{ path: field, message: expect.any(String) }]) })
            expect(next).not.toHaveBeenCalled()
        })
        it('should normalize valid input before continuing', () => {
            req.body = { ...user, firstname: ' Clark ', email: 'TEST@MAIL.COM' }
            validate(registerSchema)(req, res, next)
            expect(req.body.firstname).toBe('Clark')
            expect(req.body.email).toBe('test@mail.com')
            expect(next).toHaveBeenCalledTimes(1)
            expect(res.json).not.toHaveBeenCalled()
        })
        it('should reject unknown properties', () => {
            req.body = { ...user, picture: 'avatar.png' }
            validate(registerSchema)(req, res, next)
            expect(res.status).toHaveBeenCalledWith(422)
            expect(next).not.toHaveBeenCalled()
        })
    })

    describe('auth validation', () => {
        it.each(['12', 'invalid email', 'bad@'])('should reject identifier %s', identifiant => {
            req.body = { identifiant, password: 'Pass1234!' }
            validate(loginSchema)(req, res, next)
            expect(res.status).toHaveBeenCalledWith(422)
            expect(next).not.toHaveBeenCalled()
        })
        it.each(['test@mail.com', 'Superman'])('should accept identifier %s', identifiant => {
            req.body = { identifiant, password: 'Pass1234!' }
            validate(loginSchema)(req, res, next)
            expect(next).toHaveBeenCalledTimes(1)
        })
        it('should reject an invalid reset email', () => {
            req.body = { email: 'invalid' }
            validate(sendTokenSchema)(req, res, next)
            expect(res.status).toHaveBeenCalledWith(422)
            expect(next).not.toHaveBeenCalled()
        })
        it('should reject a weak reset password', () => {
            req.body = { password: 'pass' }
            validate(resetPasswordSchema)(req, res, next)
            expect(res.status).toHaveBeenCalledWith(422)
            expect(next).not.toHaveBeenCalled()
        })
    })

    describe('tournament validation', () => {
        it('should accept a valid tournament', () => {
            req.body = tournament
            validate(createTournamentSchema)(req, res, next)
            expect(next).toHaveBeenCalledTimes(1)
        })
        it.each([
            ['name', undefined], ['format', 'x'], ['date', '2020-01-01T00:00:00Z'],
            ['date', 'invalid'], ['paf', 0], ['paf', -5], ['paf', '5'], ['price', 5], ['location', 'x']
        ])('should reject invalid %s (%s)', (field, value) => {
            req.body = { ...tournament, [field]: value }
            validate(createTournamentSchema)(req, res, next)
            expect(res.status).toHaveBeenCalledWith(422)
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ invalidParams: expect.arrayContaining([{ path: field, message: expect.any(String) }]) }))
            expect(next).not.toHaveBeenCalled()
        })
        it('should allow a partial tournament update', () => {
            req.body = { location: 'Lyon' }
            validate(updateTournamentSchema)(req, res, next)
            expect(next).toHaveBeenCalledTimes(1)
        })
        it('should allow a partial user update', () => {
            req.body = { firstname: 'Bruce' }
            validate(updateSchema)(req, res, next)
            expect(next).toHaveBeenCalledTimes(1)
        })
    })
})
