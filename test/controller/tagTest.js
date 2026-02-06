/**
 * Colly | tag controller tests
 */

import { expect } from "chai"
import mongoose from "mongoose"

import { connectDbAsync } from "./../../src/init.js"
import controller from "./../../src/controller/tag.js"
import user from "./../../src/controller/user.js"

const Tag = mongoose.model("Tag")
const User = mongoose.model("User")
const Workspace = mongoose.model("Workspace")

const TEST_PREFIX = "test-ctrl-tag-"

describe("tag controller", () => {
    let userId
    let wrongUserId
    let wsId

    before(async () => {
        await connectDbAsync()

        const createdUser = await user.create({
            username: `${TEST_PREFIX}savvy_surfer77`,
            password: "Qwerty12345!",
        })
        userId = createdUser.id
        const wrongUser = await user.create({
            username: `${TEST_PREFIX}gaming_master777`,
            password: "Secure123$Password",
        })
        wrongUserId = wrongUser.id
        const createdWorkspace = await Workspace.create({
            name: `${TEST_PREFIX}EchoBin`,
            members: [
                {
                    user: userId,
                    permissionLevel: "admin",
                },
            ],
        })
        wsId = createdWorkspace.id
    })

    describe("#create", () => {
        it("should create a new tag", async () => {
            const tag = await controller.create({
                name: `${TEST_PREFIX}introduction-to-ai`,
                firstColor: "ff5733",
                secondColor: "ffd700",
                workspace: wsId,
            })

            expect(tag.id).to.be.not.null
            expect(tag.name).to.equal(`${TEST_PREFIX}introduction-to-ai`)
        })

        it("throws error with invalid tag name", async () => {
            try {
                await controller.create({
                    name: `${TEST_PREFIX}web-design !tips?`,
                    firstColor: "8a2be2",
                    secondColor: "00ff00",
                    workspace: wsId,
                })
            } catch (e) {
                expect(e.name).to.equal("ValidationError")
            }
        })

        it("throws error with invalid color", async () => {
            try {
                await controller.create({
                    name: `${TEST_PREFIX}healthy-eating-habits`,
                    firstColor: "80x00k",
                    secondColor: "ff6347",
                    workspace: wsId,
                })
            } catch (e) {
                expect(e.name).to.equal("ValidationError")
            }
        })
    })

    describe("#update", () => {
        it("should update a tag", async () => {
            const tag = await controller.create({
                name: `${TEST_PREFIX}travel-destinations-guide`,
                firstColor: "00bfff",
                secondColor: "ff1493",
                workspace: wsId,
            })

            expect(tag.name).to.equal(`${TEST_PREFIX}travel-destinations-guide`)

            const updatedTag = await controller.update(tag.id, {
                name: `${TEST_PREFIX}mindfulness-meditation`,
                firstColor: "9932cc",
                secondColor: "ff4500",
                workspace: wsId,
            })

            expect(updatedTag.name).to.equal(
                `${TEST_PREFIX}mindfulness-meditation`
            )
        })

        it("throws error for non-existing tag", async () => {
            try {
                await controller.update("6675932d4f2094eb2ec739ad", {
                    name: `${TEST_PREFIX}coding-best-practices`,
                    firstColor: "ff8c00",
                    secondColor: "8fbc8f",
                    workspace: wsId,
                })
            } catch (e) {
                expect(e.name).to.equal("NotFoundError")
            }
        })
    })

    describe("#del", () => {
        it("should delete the new tag", async () => {
            const tag = await controller.create({
                name: `${TEST_PREFIX}financial-planning-tips`,
                firstColor: "2e8b57",
                secondColor: "ba55d3",
                workspace: wsId,
            })

            await controller.del(tag.id)
        })
    })

    describe("#find", () => {
        it("should return empty tag list", async () => {
            const tags = await controller.find()

            expect(tags).to.be.an("array")
        })

        it("should return created tag list", async () => {
            await controller.create({
                name: `${TEST_PREFIX}beginner-yoga-poses`,
                firstColor: "1e90ff",
                secondColor: "ffd700",
                workspace: wsId,
            })

            const tags = await controller.find()

            expect(
                tags.some(
                    (tagObj) =>
                        tagObj.name === `${TEST_PREFIX}beginner-yoga-poses`
                )
            ).to.be.true
        })
    })

    describe("#hasPermission", () => {
        it("should return true for valid permission", async () => {
            const tag = await controller.create({
                name: `${TEST_PREFIX}healthy-eating-habits`,
                firstColor: "0000ff",
                secondColor: "ff00ff",
                workspace: wsId,
            })

            const hasPermission = await controller.hasPermission(
                tag.id,
                userId,
                "admin"
            )

            expect(hasPermission).to.be.true
        })

        it("should return false for invalid permission", async () => {
            const tag = await controller.create({
                name: `${TEST_PREFIX}coding-best-practices`,
                firstColor: "556b2f",
                secondColor: "b0e0e6",
                workspace: wsId,
            })

            const hasPermission = await controller.hasPermission(
                tag.id,
                wrongUserId,
                "read"
            )

            expect(hasPermission).to.be.false
        })

        it("should return false for non-existing tag", async () => {
            const hasPermission = await controller.hasPermission(
                "68931a72227b1575f186cad1",
                userId,
                "admin"
            )

            expect(hasPermission).to.be.false
        })
    })

    afterEach(async () => {
        await Tag.findOneAndDelete({
            name: /^test-ctrl-tag-.*/,
        })
    })

    after(async () => {
        await Workspace.findByIdAndDelete(wsId)
        await User.findByIdAndDelete(userId)
        await User.findByIdAndDelete(wrongUserId)
    })
})
