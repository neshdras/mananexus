process.env.JWT_SECRET = 'test-secret'

jest.mock('../model/userModel', () => ({ findUserById: jest.fn() }))

const jwt = require('jsonwebtoken')
const { findUserById } = require('../model/userModel')
const { authMiddleware } = require('./authMiddleware')

describe('authMiddleware', () => {
    let res, next

    beforeEach(() => {
        jest.resetAllMocks()
        res = { status: jest.fn().mockReturnThis(), json: jest.fn() }
        next = jest.fn()
    })

    it('accepts a valid tokenAccess cookie without a token cookie', async () => {
        const user = { id_user: 1 }
        findUserById.mockResolvedValue(user)
        const req = { cookies: { tokenAccess: jwt.sign({ id: 1 }, 'test-secret', { expiresIn: 900 }) } }

        await authMiddleware(req, res, next)

        expect(findUserById).toHaveBeenCalledWith(1)
        expect(req.user).toEqual(user)
        expect(next).toHaveBeenCalledTimes(1)
        expect(res.status).not.toHaveBeenCalled()
    })

    it.each([undefined, {}, { token: 'legacy-cookie' }])('rejects missing access cookies: %j', async cookies => {
        await authMiddleware({ cookies }, res, next)

        expect(res.status).toHaveBeenCalledWith(401)
        expect(findUserById).not.toHaveBeenCalled()
        expect(next).not.toHaveBeenCalled()
    })

    it.each(['invalid', jwt.sign({ id: 1 }, 'test-secret', { expiresIn: -1 })])('rejects an invalid or expired access token', async tokenAccess => {
        await authMiddleware({ cookies: { tokenAccess } }, res, next)

        expect(res.status).toHaveBeenCalledWith(401)
        expect(findUserById).not.toHaveBeenCalled()
        expect(next).not.toHaveBeenCalled()
    })

    it('rejects a user who no longer exists', async () => {
        findUserById.mockResolvedValue(null)
        const tokenAccess = jwt.sign({ id: 1 }, 'test-secret', { expiresIn: 900 })

        await authMiddleware({ cookies: { tokenAccess } }, res, next)

        expect(res.status).toHaveBeenCalledWith(401)
        expect(next).not.toHaveBeenCalled()
    })
})
