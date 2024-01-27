/**
 * Colly | auth router tests
 */

import { expect, use as chaiUse } from "chai"
import chaiHttp from "chai-http"
import mongoose from "mongoose"

import app from "./../../appInit.js"
import { createUser } from "./../../app/controller/user.js"

const User = mongoose.model("User")

const chai = chaiUse(chaiHttp)

describe("auth router", () => {
    before(function (done) {
        const prepare = async () => {
            await createUser("routeauthtester", "testPW123", false)

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

    describe("post /api/auth/login", () => {
        it("should authenticate successfully", async () => {
            const res = await chai
                .request(app)
                .post("/api/auth/login")
                .set("Content-Type", "application/json")
                .send({
                    username: "routeauthtester",
                    password: "testPW123",
                })

            expect(res).to.have.status(200)
            expect(res.body.token).to.be.not.null
            expect(res.body.user.username).to.eq("routeauthtester")
        })

        it("should fail auth with wrong credentials", async () => {
            const res = await chai
                .request(app)
                .post("/api/auth/login")
                .set("Content-Type", "application/json")
                .send({
                    username: "routeauthtester",
                    password: "wrongPassword456",
                })

            expect(res).to.have.status(401)
            expect(res.body.error).to.be.true
            expect(res.body.error_code).to.eq("invalid_credentials")
        })

        it("should fail auth with non-existing user", async () => {
            const res = await chai
                .request(app)
                .post("/api/auth/login")
                .set("Content-Type", "application/json")
                .send({
                    username: "nottherouteauthtester",
                    password: "testPW123",
                })

            expect(res).to.have.status(401)
            expect(res.body.error).to.be.true
            expect(res.body.error_code).to.eq("invalid_credentials")
        })
    })

    describe("get /api/auth/me", () => {
        it("should return user object", async () => {
            const authRes = await chai
                .request(app)
                .post("/api/auth/login")
                .set("Content-Type", "application/json")
                .send({
                    username: "routeauthtester",
                    password: "testPW123",
                })

            const token = authRes.body.token

            const res = await chai
                .request(app)
                .get("/api/auth/me")
                .set("Content-Type", "application/json")
                .set("Authorization", `Bearer ${token}`)
                .send()

            expect(res).to.have.status(200)
            expect(res.body.user.username).to.eq("routeauthtester")
        })

        it("should throw error with invalid token", async () => {
            const token = "invalidToken123"

            const res = await chai
                .request(app)
                .get("/api/auth/me")
                .set("Content-Type", "application/json")
                .set("Authorization", `Bearer ${token}`)
                .send()

            expect(res).to.have.status(401)
            expect(res.text).to.include("Unauthorized")
        })

        it("should throw error without any token", async () => {
            const res = await chai
                .request(app)
                .get("/api/auth/me")
                .set("Content-Type", "application/json")
                .send()

            expect(res).to.have.status(401)
            expect(res.text).to.include("Unauthorized")
        })
    })

    after(async () => {
        await User.findOneAndDelete({
            username: "routeauthtester",
        })
    })
})
