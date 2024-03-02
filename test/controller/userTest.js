/**
 * Colly | user controller tests
 */

import { expect } from "chai"
import mongoose from "mongoose"

import { connectDbAsync } from "./../../app/init.js"
import controller from "./../../app/controller/user.js"

const User = mongoose.model("User")

describe("user controller", () => {
    before(async () => {
        await connectDbAsync()
    })

    describe("#create", () => {
        it("should create a new user", async () => {
            const user = await controller.create({
                username: "test-ctrl-user-everyday-joe42",
                password: "5tr0ngP@ssw0rd!",
            })

            expect(user.id).to.be.not.null
            expect(user.username).to.equal("test-ctrl-user-everyday-joe42")
        })

        it("should create an admin user", async () => {
            const user = await controller.create({
                username: "test-ctrl-user-regular_jane23",
                password: "summer2023",
                isAdmin: true,
            })

            expect(user.id).to.be.not.null
            expect(user.isAdmin).to.be.true
        })

        it("throws error with invalid username", async () => {
            try {
                await controller.create({
                    username: "test-ctrl-user-average _ user88 $!",
                    password: "letmein456",
                })
            } catch (e) {
                expect(e.name).to.equal("ValidationError")
            }
        })
    })

    describe("#update", () => {
        it("should update a created user", async () => {
            const user = await controller.create({
                username: "test-ctrl-user-plain-pete77",
                password: "iloveyou!",
            })

            expect(user.username).to.equal("test-ctrl-user-plain-pete77")
            expect(user.isAdmin).to.be.false

            const updatedUser = await controller.update(user.id, {
                username: "test-ctrl-user-common.chris56",
                isAdmin: true,
            })

            expect(updatedUser.username).to.equal(
                "test-ctrl-user-common.chris56"
            )
            expect(updatedUser.isAdmin).to.be.true
        })

        it("throws error for non-existing user", async () => {
            try {
                await controller.update("6675932d4f2094eb2ec739ad", {
                    username: "test-ctrl-user-standard_sarah31",
                    isAdmin: true,
                })
            } catch (e) {
                expect(e.name).to.equal("NotFoundError")
            }
        })
    })

    describe("#del", () => {
        it("should delete the new user", async () => {
            const user = await controller.create({
                username: "test-ctrl-user-typical.tom99",
                password: "P@ssw0rd",
            })

            await controller.del(user.id)
        })

        it("should delete not existing user", async () => {
            await controller.del("6675932d4f2094eb2ec739ad")
        })
    })

    describe("#find", () => {
        it("should return empty user list", async () => {
            const users = await controller.find()

            expect(users).to.be.an("array")
        })

        it("should return created user list", async () => {
            await controller.create({
                username: "test-ctrl-user-regular-rachel74",
                password: "welcome2024",
            })

            const users = await controller.find()

            expect(
                users.some(
                    (usrObj) =>
                        usrObj.username === "test-ctrl-user-regular-rachel74"
                )
            ).to.be.true
        })
    })

    afterEach(async () => {
        await User.findOneAndDelete({
            username: /^test-ctrl-user-.*/,
        })
    })
})
