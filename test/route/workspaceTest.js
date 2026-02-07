/**
 * Colly | workspace router tests
 */

import { expect } from "chai"
import request from "supertest"
import mongoose from "mongoose"

import app from "./../../dist/appInit.js"
import user from "./../../dist/controller/user.js"

const User = mongoose.model("User")
const Workspace = mongoose.model("Workspace")

const TEST_PREFIX = "test-route-workspace-"

const OTHER_USER_USERNAME = `${TEST_PREFIX}MysticScribe67`

describe("workspace router", () => {
    let uid
    let token
    let otherUid

    before(function (done) {
        const prepare = async () => {
            const createdUser = await user.create({
                username: `${TEST_PREFIX}FrostyDragonfly`,
                password: "Secur1tyIsK3y!",
            })
            uid = createdUser.id
            token = user.generateToken(createdUser)

            const createdOtherUser = await user.create({
                username: OTHER_USER_USERNAME,
                password: "2F@ct0rAuth3nt!c@tion",
            })
            otherUid = createdOtherUser.id

            done()
        }

        if (mongoose.connection.readyState === 1) {
            ;(async () => {
                await prepare()
            })()
        }

        mongoose.connection.on("connected", prepare)
    })

    describe("get /api/workspace", () => {
        it("should list all workspaces", async () => {
            const res = await request(app)
                .get(`/api/workspace`)
                .set("Content-Type", "application/json")
                .set("Authorization", `Bearer ${token}`)
                .send()

            expect(res.status).to.eq(200)
            expect(res.body.data).to.be.an("array")
        })
    })

    describe("get /api/workspace/userByUsername/:username", () => {
        it("should return a user ID by its username", async () => {
            const res = await request(app)
                .get(`/api/workspace/userByUsername/${OTHER_USER_USERNAME}`)
                .set("Content-Type", "application/json")
                .set("Authorization", `Bearer ${token}`)
                .send()

            expect(res.status).to.eq(200)
            expect(res.body.data._id).to.eq(otherUid)
        })
    })

    afterEach(async () => {
        await Workspace.findOneAndDelete({
            name: /^test-route-workspace-.*/,
        })
    })

    after(async () => {
        await User.findByIdAndDelete(uid)
        await User.findByIdAndDelete(otherUid)
    })
})
