process.env.JWT_SECRET = 'test-secret'

jest.mock('../config/database', () => ({ query: jest.fn() }))
jest.mock('../tools/mailSender', () => jest.fn())

const express = require('express')
const cookieParser = require('cookie-parser')
const jwt = require('jsonwebtoken')
const db = require('../config/database')
const authRoute = require('./authRoute')

describe('session routes', () => {
    let server, baseUrl

    beforeAll(async () => {
        const app = express()
        app.use(cookieParser())
        app.use('/auth', authRoute)
        await new Promise(resolve => { server = app.listen(0, '127.0.0.1', resolve) })
        baseUrl = `http://127.0.0.1:${server.address().port}/auth`
    })

    afterAll(async () => {
        await new Promise(resolve => server.close(resolve))
    })

    beforeEach(() => jest.resetAllMocks())

    it('rejects a request without a session', async () => {
        const response = await fetch(`${baseUrl}/me`)
        expect(response.status).toBe(401)
        expect(db.query).not.toHaveBeenCalled()
    })

    it('restores the authenticated user with a renewed cookie and excludes private fields', async () => {
        const user = { id_user: 1, firstname_user: 'Clark', lastname_user: 'Kent',
            pseudo_user: 'Superman', email_user: 'test@example.com', picture_user: null }
        db.query.mockResolvedValue({ rows: [{ ...user, password_user: 'private-hash', reset_token: 'private-token' }] })
        const tokenRefresh = jwt.sign({ id: 1 }, 'test-secret', { expiresIn: '7d' })
        const refresh = await fetch(`${baseUrl}/refresh`, {
            method: 'POST', headers: { Cookie: `tokenRefresh=${tokenRefresh}` },
        })
        expect(refresh.status).toBe(200)
        const cookie = refresh.headers.get('set-cookie').split(';')[0]
        expect(cookie).toMatch(/^tokenAccess=/)

        const response = await fetch(`${baseUrl}/me`, { headers: { Cookie: cookie } })
        expect(response.status).toBe(200)
        expect(await response.json()).toEqual({ user })
    })
})
