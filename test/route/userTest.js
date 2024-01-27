/**
 * Colly | user router tests
 */

import { expect, use as chaiUse } from "chai"
import chaiHttp from "chai-http"
import mongoose from "mongoose"

import app from "./../../appInit.js"
import { createUser, getUser } from "./../../app/controller/user.js"

const User = mongoose.model("User")

const chai = chaiUse(chaiHttp)

describe("user router", () => {
    let token

    before(function (done) {
        const prepare = async () => {
            await createUser("routetestadmin", "testPW123", true)

            const res = await chai
                .request(app)
                .post("/api/auth/login")
                .set("Content-Type", "application/json")
                .send({
                    username: "routetestadmin",
                    password: "testPW123",
                })

            token = res.body.token

            done()
        }

        if (mongoose.connection.readyState === 1) {
            // eslint-disable-next-line no-extra-semi
            ;(async () => {
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
                    username: "routetestuser",
                    password: "testPW123",
                })

            expect(res).to.have.status(200)
            expect(res.body.userId).to.be.not.null

            const newUser = await getUser(res.body.userId)

            expect(newUser.username).to.equal("routetestuser")
        })
    })

    describe("patch /api/user/:userId", () => {
        it("should update the user", async () => {
            const user = await createUser("routetestuser", "testPW123")

            const res = await chai
                .request(app)
                .patch(`/api/user/${user.id}`)
                .set("Content-Type", "application/json")
                .set("Authorization", `Bearer ${token}`)
                .send({
                    username: "newtestuser",
                    isAdmin: true,
                })

            expect(res).to.have.status(200)

            const updatedUser = await getUser(res.body.userId)

            expect(updatedUser.username).to.equal("newtestuser")
            expect(updatedUser.isAdmin).to.be.true
        })
    })

    describe("delete /api/user/:userId", () => {
        it("should delete the created user", async () => {
            const user = await createUser("routetestuser", "testPW123")

            const res = await chai
                .request(app)
                .delete(`/api/user/${user.id}`)
                .set("Content-Type", "application/json")
                .set("Authorization", `Bearer ${token}`)
                .send()

            expect(res).to.have.status(200)
            expect(res.body.userId).to.eq(user.id)

            const deletedUser = await getUser(user.id)

            expect(deletedUser).to.be.null
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
            username: {
                $in: ["routetestuser", "newtestuser"],
            },
        })
    })

    after(async () => {
        await User.findOneAndDelete({
            username: "routetestadmin",
        })
    })
})
