// La base et les services externes sont simulés sans charger leur configuration.
jest.mock('../config/database', () => ({ query: jest.fn() }))
jest.mock('../tools/mailSender', () => jest.fn())
jest.mock('jsonwebtoken')
jest.mock('bcryptjs')

const previousSecret = process.env.JWT_SECRET
process.env.JWT_SECRET = 'test-secret'
const db = require('../config/database')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const mailSender = require('../tools/mailSender')
const { register, login, sendToken, forgetPass, refreshAuth } = require('./authController')

describe('Auth Controller', () => {
    let req, res, user
    beforeEach(() => {
        jest.resetAllMocks()
        user = { id_user: 1, firstname_user: 'Clark', lastname_user: 'Kent', pseudo_user: 'Superman', email_user: 'test@mail.com', picture_user: null }
        req = {
            body: { firstname: 'Clark', lastname: 'Kent', pseudo: 'Superman', email: 'test@mail.com', password: 'Pass1234!' },
            params: { token: 'reset-token' },
            cookies: { tokenRefresh: 'refresh-token' }
        }
        res = { status: jest.fn().mockReturnThis(), json: jest.fn(), cookie: jest.fn().mockReturnThis() }
        bcrypt.hash.mockResolvedValue('hashed-password')
        jwt.verify.mockReturnValue({ id: 1 })
    })
    afterAll(() => {
        if (previousSecret === undefined) delete process.env.JWT_SECRET
        else process.env.JWT_SECRET = previousSecret
    })

    describe('register', () => {
        it('should register and connect a new user', async () => {
            db.query.mockResolvedValueOnce({ rows: [] }).mockResolvedValueOnce({ rows: [] }).mockResolvedValueOnce({ rows: [user] })
            jwt.sign.mockReturnValueOnce('refresh-token').mockReturnValueOnce('access-token')
            await register(req, res)
            expect(bcrypt.hash).toHaveBeenCalledWith('Pass1234!', 15)
            expect(db.query).toHaveBeenCalledTimes(3)
            expect(db.query).toHaveBeenNthCalledWith(3, expect.stringContaining('INSERT INTO users'), ['Clark', 'Kent', 'Superman', 'test@mail.com', 'hashed-password', null])
            expect(jwt.sign).toHaveBeenNthCalledWith(1, { id: 1 }, 'test-secret', { expiresIn: '7d' })
            expect(jwt.sign).toHaveBeenNthCalledWith(2, { id: 1 }, 'test-secret', { expiresIn: 900 })
            expect(res.cookie).toHaveBeenCalledWith('tokenRefresh', 'refresh-token', expect.objectContaining({ httpOnly: true, sameSite: 'lax', maxAge: 604800000 }))
            expect(res.cookie).toHaveBeenCalledWith('tokenAccess', 'access-token', expect.objectContaining({ httpOnly: true }))
            expect(res.status).toHaveBeenCalledWith(201)
            expect(res.json).toHaveBeenCalledWith({ title: 'Created', status: 201, detail: 'User create successfully', user })
        })
        it('should return 400 if email is already used', async () => {
            db.query.mockResolvedValueOnce({ rows: [user] })
            await register(req, res)
            expect(res.status).toHaveBeenCalledWith(400)
            expect(res.json).toHaveBeenCalledWith({ title: 'Bad request', status: 400, detail: 'Email already use' })
            expect(db.query).toHaveBeenCalledTimes(1)
            expect(bcrypt.hash).not.toHaveBeenCalled()
            expect(res.cookie).not.toHaveBeenCalled()
        })
        it('should return 400 if pseudo is already used', async () => {
            db.query.mockResolvedValueOnce({ rows: [] }).mockResolvedValueOnce({ rows: [user] })
            await register(req, res)
            expect(res.status).toHaveBeenCalledWith(400)
            expect(res.json).toHaveBeenCalledWith({ title: 'Bad request', status: 400, detail: 'Pseudo already use' })
            expect(db.query).toHaveBeenCalledTimes(2)
            expect(bcrypt.hash).not.toHaveBeenCalled()
        })
    })

    describe('login', () => {
        beforeEach(() => { req.body = { identifiant: 'test@mail.com', password: 'Pass1234!' } })
        it.each(['test@mail.com', 'Superman'])('should connect with %s', async identifiant => {
            req.body.identifiant = identifiant
            db.query.mockResolvedValueOnce({ rows: [{ ...user, password_user: 'hashed-password' }] })
            bcrypt.compare.mockResolvedValue(true)
            jwt.sign.mockReturnValueOnce('refresh-token').mockReturnValueOnce('access-token')
            await login(req, res)
            expect(db.query).toHaveBeenCalledWith(expect.stringContaining(identifiant.includes('@') ? 'email_user = $1' : 'pseudo_user = $1'), [identifiant])
            expect(bcrypt.compare).toHaveBeenCalledWith('Pass1234!', 'hashed-password')
            expect(jwt.sign).toHaveBeenNthCalledWith(1, { id: 1 }, 'test-secret', { expiresIn: '7d' })
            expect(jwt.sign).toHaveBeenNthCalledWith(2, { id: 1 }, 'test-secret', { expiresIn: 900 })
            expect(res.cookie).toHaveBeenCalledWith('tokenAccess', 'access-token', expect.objectContaining({ httpOnly: true, maxAge: 900000 }))
            expect(res.cookie).toHaveBeenCalledWith('tokenRefresh', 'refresh-token', expect.objectContaining({ httpOnly: true, maxAge: 604800000 }))
            expect(res.status).toHaveBeenCalledWith(200)
            expect(res.json).toHaveBeenCalledWith({ title: 'Success', status: 200, detail: 'Login successfully', user })
        })
        it('should return 401 if user does not exist', async () => {
            db.query.mockResolvedValueOnce({ rows: [] })
            await login(req, res)
            expect(res.status).toHaveBeenCalledWith(401)
            expect(res.json).toHaveBeenCalledWith({ title: 'Unauthorized', status: 401, detail: 'Identifiants incorrects' })
            expect(bcrypt.compare).not.toHaveBeenCalled()
            expect(res.cookie).not.toHaveBeenCalled()
        })
        it('should return 401 if password is wrong', async () => {
            db.query.mockResolvedValueOnce({ rows: [{ ...user, password_user: 'hashed-password' }] })
            bcrypt.compare.mockResolvedValue(false)
            await login(req, res)
            expect(res.status).toHaveBeenCalledWith(401)
            expect(res.json).toHaveBeenCalledWith({ title: 'Unauthorized', status: 401, detail: 'Identifiants incorrects' })
            expect(jwt.sign).not.toHaveBeenCalled()
            expect(res.cookie).not.toHaveBeenCalled()
        })
    })

    describe('sendToken', () => {
        it('should return 400 if email is invalid', async () => {
            req.body.email = 'invalid'
            await sendToken(req, res)
            expect(res.status).toHaveBeenCalledWith(400)
            expect(res.json).toHaveBeenCalledWith({ title: 'Bad request', status: 400, detail: 'Please provide a good email' })
            expect(db.query).not.toHaveBeenCalled()
            expect(mailSender).not.toHaveBeenCalled()
        })
        it('should return 400 if email does not exist', async () => {
            db.query.mockResolvedValueOnce({ rows: [] })
            await sendToken(req, res)
            expect(res.status).toHaveBeenCalledWith(400)
            expect(res.json).toHaveBeenCalledWith({ title: 'Bad request', status: 400, detail: 'Please provide the information ask.' })
            expect(db.query).toHaveBeenCalledTimes(1)
            expect(mailSender).not.toHaveBeenCalled()
        })
        it('should save the token for this user and send the email', async () => {
            db.query.mockResolvedValueOnce({ rows: [user] }).mockResolvedValueOnce({ rows: [] })
            jwt.sign.mockReturnValue('reset-token')
            mailSender.mockResolvedValue(undefined)
            await sendToken(req, res)
            expect(jwt.sign).toHaveBeenCalledWith({ id: 1 }, 'test-secret', { expiresIn: '15min' })
            expect(db.query).toHaveBeenNthCalledWith(2, expect.stringContaining('UPDATE users'), ['reset-token', 1])
            expect(mailSender).toHaveBeenCalledWith('reset-token', 'test@mail.com')
            expect(res.status).toHaveBeenCalledWith(200)
            expect(res.json).toHaveBeenCalledWith({ title: 'Mail send', status: 200, detail: 'The mail to reset password was send successfully' })
        })
        it('should propagate email errors without reporting success', async () => {
            db.query.mockResolvedValueOnce({ rows: [user] }).mockResolvedValueOnce({ rows: [] })
            mailSender.mockRejectedValue(new Error('Email unavailable'))
            await expect(sendToken(req, res)).rejects.toThrow('Email unavailable')
            expect(res.json).not.toHaveBeenCalled()
        })
    })

    describe('forgetPass', () => {
        it('should update the password and invalidate the reset token', async () => {
            db.query.mockResolvedValueOnce({ rows: [{ count: '1' }] }).mockResolvedValueOnce({ rows: [] })
            await forgetPass(req, res)
            expect(jwt.verify).toHaveBeenCalledWith('reset-token', 'test-secret')
            expect(db.query).toHaveBeenNthCalledWith(1, expect.stringContaining('SELECT COUNT'), ['reset-token', 1])
            expect(bcrypt.hash).toHaveBeenCalledWith('Pass1234!', 15)
            expect(db.query).toHaveBeenNthCalledWith(2, expect.stringContaining('token_password_forget = null'), ['hashed-password', 1])
            expect(res.json).toHaveBeenCalledWith({ title: 'Success', status: 200, detail: 'Password has been modified' })
        })
        it('should return 400 if password is too weak', async () => {
            req.body.password = 'pass'
            await forgetPass(req, res)
            expect(res.status).toHaveBeenCalledWith(400)
            expect(res.json).toHaveBeenCalledWith({ title: 'Bad request', status: 400, detail: 'The password need to have 1 lower, 1 upper, 1 number and 1 symbol and 6 character long min' })
            expect(db.query).not.toHaveBeenCalled()
        })
        it('should return 400 if token is not stored for this user', async () => {
            db.query.mockResolvedValueOnce({ rows: [{ count: '0' }] })
            await forgetPass(req, res)
            expect(res.status).toHaveBeenCalledWith(400)
            expect(res.json).toHaveBeenCalledWith({ title: 'Bad request', status: 400, detail: 'Wrong information' })
            expect(db.query).toHaveBeenCalledTimes(1)
            expect(bcrypt.hash).not.toHaveBeenCalled()
        })
        it.each([['jwt expired', 400], ['invalid signature', 500]])('should handle %s', async (message, status) => {
            jwt.verify.mockImplementation(() => { throw new Error(message) })
            await forgetPass(req, res)
            expect(res.status).toHaveBeenCalledWith(status)
            expect(res.json).toHaveBeenCalledWith({ title: status === 400 ? 'Bad request' : 'Server error', status: status, detail: message })
            expect(db.query).not.toHaveBeenCalled()
        })
        it('should return 500 if the database fails', async () => {
            db.query.mockRejectedValueOnce(new Error('Database unavailable'))
            await forgetPass(req, res)
            expect(res.status).toHaveBeenCalledWith(500)
            expect(res.json).toHaveBeenCalledWith({ title: 'Server error', status: 500, detail: 'Database unavailable' })
        })
    })

    describe('refreshAuth', () => {
        it('should renew the access token', async () => {
            jwt.sign.mockReturnValue('new-access-token')
            await refreshAuth(req, res)
            expect(jwt.verify).toHaveBeenCalledWith('refresh-token', 'test-secret')
            expect(jwt.sign).toHaveBeenCalledWith({ id: 1 }, 'test-secret', { expiresIn: 900 })
            expect(res.cookie).toHaveBeenCalledWith('tokenAccess', 'new-access-token', expect.objectContaining({ httpOnly: true, maxAge: 900000 }))
            expect(res.status).toHaveBeenCalledWith(200)
            expect(res.json).toHaveBeenCalledWith({ title: 'Success', status: 200, detail: 'Access token refreshed' })
        })
        it('should return 404 if refresh cookie is missing', async () => {
            req.cookies = {}
            await refreshAuth(req, res)
            expect(res.status).toHaveBeenCalledWith(404)
            expect(res.json).toHaveBeenCalledWith({ title: 'Not found', status: 404, detail: 'Token not found, please reconnect. ' })
            expect(jwt.verify).not.toHaveBeenCalled()
            expect(res.cookie).not.toHaveBeenCalled()
        })
        it.each(['jwt expired', 'invalid signature'])('should reject %s', async message => {
            jwt.verify.mockImplementation(() => { throw new Error(message) })
            await refreshAuth(req, res)
            expect(res.status).toHaveBeenCalledWith(400)
            expect(res.json).toHaveBeenCalledWith({ title: 'Bad request', status: 400, detail: message })
            expect(res.cookie).not.toHaveBeenCalled()
        })
    })
})
