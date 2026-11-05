jest.mock('../config/database', () => ({ query: jest.fn() }))
jest.mock('bcryptjs')

const db = require('../config/database')
const bcrypt = require('bcryptjs')
const { getProfile, updateUser, seeRanking } = require('./userController')

describe('User Controller', () => {
    let req, res
    beforeEach(() => {
        jest.resetAllMocks()
        req = {
            params: {}, body: {},
            user: { id_user: 1, firstname_user: 'Clark', lastname_user: 'Kent', pseudo_user: 'Superman', email_user: 'test@mail.com', password_user: 'old-hash', picture_user: 'avatar.png' }
        }
        res = { status: jest.fn().mockReturnThis(), json: jest.fn() }
    })

    describe('getProfile', () => {
        it('should return the connected user when no id is supplied', async () => {
            await getProfile(req, res)
            expect(res.status).toHaveBeenCalledWith(200)
            expect(res.json).toHaveBeenCalledWith({ title: 'Profile retrieved', status: 200, detail: 'The connected user profile was retrieved successfully', user: req.user })
            expect(db.query).not.toHaveBeenCalled()
        })
        it('should await the profile requested by id', async () => {
            req.params.id = '2'
            const user = { id_user: 2, pseudo_user: 'Batman' }
            db.query.mockResolvedValueOnce({ rows: [user] })
            await getProfile(req, res)
            expect(db.query).toHaveBeenCalledWith(expect.stringContaining('id_user = $1'), ['2'])
            expect(res.status).toHaveBeenCalledWith(200)
            expect(res.json).toHaveBeenCalledWith({ title: 'Profile retrieved', status: 200, detail: 'The requested user profile was retrieved successfully', user })
        })
        it('should return a null profile if user does not exist', async () => {
            req.params.id = '99'
            db.query.mockResolvedValueOnce({ rows: [] })
            await getProfile(req, res)
            expect(res.status).toHaveBeenCalledWith(200)
            expect(res.json).toHaveBeenCalledWith({ title: 'Profile retrieved', status: 200, detail: 'The requested user profile was retrieved successfully', user: null })
        })
    })

    describe('updateUser', () => {
        it('should update supplied fields and preserve omitted fields', async () => {
            req.body = { firstname: 'Bruce', lastname: 'Wayne' }
            db.query.mockResolvedValueOnce({ rows: [] })
            await updateUser(req, res)
            expect(db.query).toHaveBeenCalledTimes(1)
            expect(db.query).toHaveBeenCalledWith(expect.stringContaining('UPDATE users'), ['Bruce', 'Wayne', 'Superman', 'test@mail.com', 'old-hash', 'avatar.png', 1])
            expect(bcrypt.hash).not.toHaveBeenCalled()
            expect(res.status).toHaveBeenCalledWith(200)
            expect(res.json).toHaveBeenCalledWith({ title: 'Success', status: 200, detail: 'Profile updated !' })
        })
        it('should update the picture when one is supplied', async () => {
            req.body = { picture: 'new-avatar.png' }
            db.query.mockResolvedValueOnce({ rows: [] })

            await updateUser(req, res)

            expect(db.query).toHaveBeenCalledWith(expect.stringContaining('UPDATE users'), ['Clark', 'Kent', 'Superman', 'test@mail.com', 'old-hash', 'new-avatar.png', 1])
            expect(res.status).toHaveBeenCalledWith(200)
        })
        it('should update email, pseudo and hash the new password', async () => {
            req.body = { email: 'bruce@mail.com', pseudo: 'Batman', password: 'NewPass123!' }
            db.query.mockResolvedValueOnce({ rows: [] }).mockResolvedValueOnce({ rows: [] }).mockResolvedValueOnce({ rows: [] })
            bcrypt.hash.mockResolvedValue('new-hash')
            await updateUser(req, res)
            expect(bcrypt.hash).toHaveBeenCalledWith('NewPass123!', 15)
            expect(db.query).toHaveBeenNthCalledWith(1, expect.stringContaining('email_user = $1'), ['bruce@mail.com'])
            expect(db.query).toHaveBeenNthCalledWith(2, expect.stringContaining('pseudo_user = $1'), ['Batman'])
            expect(db.query).toHaveBeenNthCalledWith(3, expect.stringContaining('UPDATE users'), ['Clark', 'Kent', 'Batman', 'bruce@mail.com', 'new-hash', 'avatar.png', 1])
            expect(res.status).toHaveBeenCalledWith(200)
        })
        it.each([
            ['email', 'invalid', 'Please provide a valid email'],
            ['password', 'pass', 'The password need to have 1 lower, 1 upper, 1 number and 1 symbol and 6 character long min'],
            ['pseudo', 'ab', 'Pseudo need at least 3 characters']
        ])('should reject invalid %s', async (field, value, message) => {
            req.body = { [field]: value }
            await updateUser(req, res)
            expect(res.status).toHaveBeenCalledWith(400)
            expect(res.json).toHaveBeenCalledWith({ title: 'Bad request', status: 400, detail: message })
            expect(db.query).not.toHaveBeenCalled()
        })
        it.each([
            ['email', 'taken@mail.com', 'Email already use'],
            ['pseudo', 'Batman', 'Pseudo already exist']
        ])('should reject an existing %s', async (field, value, message) => {
            req.body = { [field]: value }
            db.query.mockResolvedValueOnce({ rows: [{ id_user: 2 }] })
            await updateUser(req, res)
            expect(res.status).toHaveBeenCalledWith(400)
            expect(res.json).toHaveBeenCalledWith({ title: 'Bad request', status: 400, detail: message })
            expect(db.query).toHaveBeenCalledTimes(1)
        })
        it('should propagate a database failure without reporting success', async () => {
            req.body = { firstname: 'Bruce' }
            db.query.mockRejectedValueOnce(new Error('Database unavailable'))
            await expect(updateUser(req, res)).rejects.toThrow('Database unavailable')
            expect(res.json).not.toHaveBeenCalled()
        })
    })

    describe('seeRanking', () => {
        it.each([{ ranking: [] }, { ranking: [{ firstname: 'Clark', lastname: 'Kent', pseudo: 'Superman', victorypts: 10 }] }])('should return ranking %#', async ({ ranking }) => {
            db.query.mockResolvedValueOnce({ rows: ranking })
            await seeRanking(req, res)
            expect(db.query).toHaveBeenCalledWith(expect.stringContaining('ORDER BY victorypts'), [])
            expect(res.status).toHaveBeenCalledWith(200)
            expect(res.json).toHaveBeenCalledWith({ title: 'Ranking retrieved', status: 200, detail: 'The ranking was retrieved successfully', ranking: ranking })
        })
    })
})
