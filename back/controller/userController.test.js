const db = require('../config/database')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const { getProfile, updateUser, seeRanking } = require('./userController')
jest.mock("jsonwebtoken")
jest.mock("bcryptjs")
jest.mock("../config/database.js")

describe('User Controller', ()=>{
    describe("getProfile", ()=>{
        let req, res
        beforeEach(()=>{
            req = {
                user: {
                    id_user : 1,
                    firstname: "Clark",
                    lastname: "Kent",
                    pseudo: null, 
                    email: "test@mail.com",
                    picture: null
                }
            }
            res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            }
            process.env.JWT_SECRET = "test-secret"
        })
        afterEach(()=>{
            jest.clearAllMocks()
        })
        
        it("should get user information", async () => {
            expect(res.status).toHaveBeenCalledWith(200)
            expect(res.json).toHaveBeenCalledWith({
                user: {
                    id_user : 1,
                    firstname: "Clark",
                    lastname: "Kent",
                    pseudo: null, 
                    email: "test@mail.com",
                    picture: null
                }
            })
            expect(db.query).not.toHaveBeenCalled()
        })
    })
    // describe("updateUser", ()=>{
    //     let req, res
    //     beforeEach(()=>{
    //         req = {
    //             user: {
    //                 id_user : 1,
    //                 firstname: "Clark",
    //                 lastname: "Kent",
    //                 pseudo: null, 
    //                 email: "test@mail.com",
    //                 picture: null
    //             }
    //         }
    //         res = {
    //             status: jest.fn().mockReturnThis(),
    //             json: jest.fn()
    //         }
    //         process.env.JWT_SECRET = "test-secret"
    //     })
    // })
    // describe("seeRanking", ()=>{
    //     let req, res
    //     beforeEach(()=>{
    //         req = {
    //             user: {
    //                 id_user : 1,
    //                 firstname: "Clark",
    //                 lastname: "Kent",
    //                 pseudo: null, 
    //                 email: "test@mail.com",
    //                 picture: null
    //             }
    //         }
    //         res = {
    //             status: jest.fn().mockReturnThis(),
    //             json: jest.fn()
    //         }
    //         process.env.JWT_SECRET = "test-secret"
    //     })
    // })
})