// const { test, describe, before, after } = require('node:test')
// const assert = require('node:assert')
// require('dotenv').config()
// const jest = require('jest')
const db = require('../config/database')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const { register, login, sendToken, forgetPass } = require('./authController')

jest.mock("jsonwebtoken")
jest.mock("bcryptjs")
jest.mock("../config/database.js")

describe('Auth Controller', () => {

    describe("register", ()=>{
        let req, res
        beforeEach(()=>{
            req = {
                body: {
                    firstname: "Clark",
                    lastname: "Kent",
                    pseudo: null, 
                    email: "test@mail.com",
                    password: "Pass1234!",
                    picture: null
                },
            };
            res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
            process.env.JWT_SECRET = "test-secret"
        })

        afterEach(()=>{
            jest.clearAllMocks()
        })

        it("should register and connect new user", async ()=>{
            db.query
            .mockResolvedValueOnce({
                rows: [{count: 0}]
            })
            .mockResolvedValueOnce({
                rows: [{count: 0}]
            })
            .mockResolvedValueOnce({
                rows: [{
                    id_user: 1,
                    firstname_user: "Clark",
                    lastname_user: "Kent",
                    pseudo_user: null, 
                    email_user: "test@mail.com",
                    picture_user: null
                }]
            })

            bcrypt.hash.mockResolvedValue("hashed-password")
            jwt.sign.mockReturnValue("fake-token")

            await register(req, res)

            expect(bcrypt.hash).toHaveBeenCalledWith("Pass1234!", 15)
            expect(db.query).toHaveBeenCalledTimes(3)
            expect(jwt.sign).toHaveBeenCalled()
            expect(res.status).toHaveBeenCalledWith(201)
            expect(res.json).toHaveBeenCalledWith({
                message: "User create successfully",
                token: "fake-token",
                user: {
                    id_user: 1,
                    firstname_user: "Clark",
                    lastname_user: "Kent",
                    pseudo_user: null,
                    email_user: "test@mail.com",
                    picture_user: null
                }
            })
        })
        it("should return 400 if an information is missing", async ()=>{
            req.body.password = undefined
            await register(req, res)
            expect(res.status).toHaveBeenCalledWith(400)
            expect(res.json).toHaveBeenCalledWith({
                message: "Please provide the information ask"
            })
            expect(db.query).not.toHaveBeenCalled()
        })
        it("Should return 400 if password is too low", async () => {
            req.body.password = "pass1"
            await register(req, res)
            expect(res.status).toHaveBeenCalledWith(400)
            expect(res.json).toHaveBeenCalledWith({
                message: "The password need to have 1 lower, 1 upper, 1 number and 1 symbol and 6 character long min"
            })
            expect(db.query).not.toHaveBeenCalled()
        })
        it("Should return 400 if email is invalid", async () => {
            req.body.email = "pass1"
            await register(req, res)
            expect(res.status).toHaveBeenCalledWith(400)
            expect(res.json).toHaveBeenCalledWith({
                message: "Please provide a valid email"
            })
            expect(db.query).not.toHaveBeenCalled()
        })
        it("Should return 400 if pseudo is too short", async () => {
            req.body.pseudo = "12"
            await register(req, res)
            expect(res.status).toHaveBeenCalledWith(400)
            expect(res.json).toHaveBeenCalledWith({
                message: "Pseudo need to have at least 3 characters"
            })
            expect(db.query).not.toHaveBeenCalled()
        })
        it("Should return 400 if email is already use", async () => {
            db.query
            .mockResolvedValueOnce({
                rows: [{count: 1}]
            })
            await register(req, res)
            expect(res.status).toHaveBeenCalledWith(400)
            expect(res.json).toHaveBeenCalledWith({
                message: "Email already use"
            })
            expect(db.query).toHaveBeenCalledTimes(1)
        })
        it("Should return 400 if pseudo is already use", async () => {
            db.query
            .mockResolvedValueOnce({
                rows: [{count: 0}]
            })
            .mockResolvedValueOnce({
                rows: [{count: 1}]
            })
            await register(req, res)
            expect(res.status).toHaveBeenCalledWith(400)
            expect(res.json).toHaveBeenCalledWith({
                message: "Pseudo already use"
            })
            expect(db.query).toHaveBeenCalledTimes(2)
        })
    })
    
    describe("login", ()=>{
        let req, res
        beforeEach(()=>{
            req = {
                body: {
                    
                    identifiant: "test@mail.com",
                    password: "Pass1234!",
                },
            };
            res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
            process.env.JWT_SECRET = "test-secret"
        })

        afterEach(()=>{
            jest.clearAllMocks()
        })
        it("Should return 400 if pseudo is too short", async () => {
            req.body.identifiant = "12"
            await login(req, res)
            expect(res.json).toHaveBeenCalledWith({
                message: "Please provide the information"
            })
            expect(db.query).not.toHaveBeenCalled()
        })
        it("Should return 400 if identifiant is invalid", async () => {
            db.query
            .mockResolvedValueOnce({
                rows: [{
                    count: 0
                }]
            })
            await login(req, res)
            expect(res.json).toHaveBeenCalledWith({
                message: "Please provide the information"
            })
            expect(db.query).toHaveBeenCalledTimes(1)
        })
        it("Should return 400 if password is wrong", async () => {
            db.query
            .mockResolvedValueOnce({
                rows: [{
                    count: 1
                }]
            })
            await bcrypt.compare.mockResolvedValue(false)
            await login(req, res)
            expect(res.json).toHaveBeenCalledWith({
                message: "Please provide the information"
            })
            expect(db.query).toHaveBeenCalledTimes(1)
        })
        it("Should return 200 if user log in", async () => {
            db.query
            .mockResolvedValueOnce({
                rows: [{
                    id_user: 1,
                    firstname_user: "Clark",
                    lastname_user: "Kent",
                    pseudo_user: null,
                    email_user: "test@mail.com",
                    password_user: "hashed-password",
                    picture_user: null,
                    count: 1
                }]
            })
            await bcrypt.compare.mockResolvedValue(true)
            jwt.sign.mockReturnValue('fake-token')
            await login(req, res)

            expect(bcrypt.compare).toHaveBeenCalledWith("Pass1234!", "hashed-password")
            expect(db.query).toHaveBeenCalled()
            expect(jwt.sign).toHaveBeenCalled()
            expect(res.status).toHaveBeenCalledWith(200)
            expect(res.json).toHaveBeenCalledWith({
                message: "Login successfully",
                token: "fake-token",
                user: {
                    id_user: 1,
                    firstname_user: "Clark",
                    lastname_user: "Kent",
                    pseudo_user: null,
                    email_user: "test@mail.com",
                    picture_user: null
                }
            })
        })
    })
    
    describe("sendToken", ()=>{
        let req, res
        beforeEach(()=>{
            req = {
                body: {
                    email: "test@mail.com",
                },
            };
            res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
            process.env.JWT_SECRET = "test-secret"
        })

        afterEach(()=>{
            jest.clearAllMocks()
        })

        it("Should return 400 if email is invalid", async () => {
            req.body.email = "pass1"
            await sendToken(req, res)
            expect(res.status).toHaveBeenCalledWith(400)
            expect(res.json).toHaveBeenCalledWith({
                message: "Please provide a good email"
            })
            expect(db.query).not.toHaveBeenCalled()
            
        })
        it("Should return 400 if email doesn't exist", async () => {
            db.query
            .mockResolvedValueOnce({
                rows:[]
            })
            await sendToken(req, res)
            expect(res.status).toHaveBeenCalledWith(400)
            expect(res.json).toHaveBeenCalledWith({
                message: "Please provide the information ask."
            })
            expect(db.query).toHaveBeenCalled()
            
        })
        it("Should return 200 if token is create", async () => {
            db.query
            .mockResolvedValueOnce({
                rows: [
                    {
                        id_user: 42,
                        count: 1
                    }
            ]
            })
            jwt.sign.mockReturnValue("fake-token")
            await sendToken(req, res)
            expect(jwt.sign).toHaveBeenCalled()
            expect(db.query).toHaveBeenCalledTimes(2)
            expect(res.json).toHaveBeenCalledWith({
                token: "fake-token"
            })
        })
    })

    describe("forgetPass", ()=>{
        let req, res
        beforeEach(()=>{
            req = {
                body: {
                    password: "Pass147!"
                },
                params: {
                    params: "fake.token.test"
                }
            }
            res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            }
        })

        afterEach(()=>{
            jest.clearAllMocks()
        })
        it("Should return 400 if password is too weak", async () =>{
            req.body.password = "pass"
            await forgetPass(req, res)
            expect(res.status).toHaveBeenCalledWith(400)
            expect(res.json).toHaveBeenCalledWith({
                message: "The password need to have 1 lower, 1 upper, 1 number and 1 symbol and 6 character long min"
            })
            expect(db.query).not.toHaveBeenCalled()

        })
        it("Should return 400 if token or id_user are invalide", async ()=>{
            jwt.verify.mockResolvedValue({id: 42})
            db.query.mockResolvedValueOnce({rows: [{count: 0}]})
            await forgetPass(req, res)
            expect(res.status).toHaveBeenCalledWith(400)
            expect(res.json).toHaveBeenCalledWith({message: 'Wrong information'})
            expect(db.query).toHaveBeenCalledTimes(1)
        })

        it("Should return 400 if token is expire", async ()=>{
            jwt.verify.mockImplementation(()=> {throw new Error("jwt expired")
            })
            await forgetPass(req, res)
            expect(res.status).toHaveBeenCalledWith(400)
            expect(res.json).toHaveBeenCalledWith({message: 'jwt expired'})
            expect(db.query).not.toHaveBeenCalled()
        })
    })
})