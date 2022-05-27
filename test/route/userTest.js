/**
 * Colly | user router tests
 */

import chai, { expect } from "chai"
import chaiHttp from "chai-http"
import mongoose from "mongoose"

import app from "./../../app.js"
import { createUser } from "./../../app/controller/user.js"

const User = mongoose.model("User")

chai.use(chaiHttp)

describe("user router", () => {
    let token

    before(function (done) {
        const prepare = async () => {
            await createUser("testadmin", "testPW123", true)

            const res = await chai
                .request(app)
                .post("/api/auth/login")
                .set("Content-Type", "application/json")
                .send({
                    username: "testadmin",
                    password: "testPW123",
                })

            token = res.body.token

            done()
        }

        if (mongoose.connection.readyState === 1) {
            // prettier-ignore
            (async () => {
                await prepare()
            })()
        }

        mongoose.connection.on("connected", prepare)
    })

    describe("post /api/user", () => {
        it("should create a new user", async () => {
            const res = await chai
                .request(app)
                .post("/api/user")
                .set("Content-Type", "application/json")
                .set("Authorization", `Bearer ${token}`)
                .send({
                    username: "testuser",
                    password: "testPW123",
                })

            expect(res).to.have.status(200)
            expect(res.body.userId).to.be.not.null
            expect(res.body.userId).to.have.lengthOf(24)
        })
    })

    describe("delete /api/user/:userId", () => {
        it("should delete the created user", async () => {
            const user = await createUser("testuser", "testPW123")

            const res = await chai
                .request(app)
                .delete(`/api/user/${user.id}`)
                .set("Content-Type", "application/json")
                .set("Authorization", `Bearer ${token}`)
                .send()

            expect(res).to.have.status(200)
            expect(res.body.userId).to.eq(user.id)
        })
    })

    describe("get /api/user", () => {
        it("should list all users", async () => {
            const res = await chai
                .request(app)
                .get("/api/user")
                .set("Content-Type", "application/json")
                .set("Authorization", `Bearer ${token}`)
                .send()

            expect(res).to.have.status(200)
            expect(res.body.users).to.be.an("array")
        })
    })

    afterEach(async () => {
        await User.findOneAndDelete({
            username: "testuser",
        })
    })

    after(async () => {
        await User.findOneAndDelete({
            username: "testadmin",
        })
    })
})
