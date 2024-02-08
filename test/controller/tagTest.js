/**
 * Colly | tag controller tests
 */

import { expect } from "chai"
import mongoose from "mongoose"

import { connectDbAsync } from "./../../app/init.js"
import controller from "./../../app/controller/tag.js"
import user from "./../../app/controller/user.js"

const Tag = mongoose.model("Tag")
const User = mongoose.model("User")

describe("tag controller", () => {
    let userId

    before(async () => {
        await connectDbAsync()

        const createdUser = await user.create({
            username: "tagtester",
            password: "testPW123",
        })
        userId = createdUser.id
    })

    describe("#create", () => {
        it("should create a new tag", async () => {
            const tag = await controller.create({
                name: "testtag",
                firstColor: "000000",
                secondColor: "ffffff",
                owner: userId,
            })

            expect(tag.id).to.be.not.null
            expect(tag.name).to.equal("testtag")
        })

        it("throws error with invalid tag name", async () => {
            try {
                await controller.create({
                    name: "Tag ! ?",
                    firstColor: "000000",
                    secondColor: "ffffff",
                    owner: userId,
                })
            } catch (e) {
                expect(e.name).to.equal("ValidationError")
            }
        })

        it("throws error with invalid color", async () => {
            try {
                await controller.create({
                    name: "testtag",
                    firstColor: "0x000k",
                    secondColor: "ffffff",
                    owner: userId,
                })
            } catch (e) {
                expect(e.name).to.equal("ValidationError")
            }
        })
    })

    describe("#update", () => {
        it("should update a tag", async () => {
            const tag = await controller.create({
                name: "testtag",
                firstColor: "000000",
                secondColor: "ffffff",
                owner: userId,
            })

            expect(tag.name).to.equal("testtag")

            const updatedTag = await controller.update(tag.id, {
                name: "othertag",
                firstColor: "000000",
                secondColor: "ffffff",
                owner: userId,
            })

            expect(updatedTag.name).to.equal("othertag")
        })

        it("throws error for non-existing tag", async () => {
            try {
                await controller.update("6675932d4f2094eb2ec739ad", {
                    name: "othertag",
                    firstColor: "000000",
                    secondColor: "ffffff",
                    owner: userId,
                })
            } catch (e) {
                expect(e.name).to.equal("NotFoundError")
            }
        })
    })

    describe("#del", () => {
        it("should delete the new tag", async () => {
            const tag = await controller.create({
                name: "testtag",
                firstColor: "000000",
                secondColor: "ffffff",
                owner: userId,
            })

            await controller.del(tag.id)
        })
    })

    describe("#list", () => {
        it("should return empty tag list", async () => {
            const tags = await controller.list()

            expect(tags).to.be.an("array")
        })

        it("should return created tag list", async () => {
            await controller.create({
                name: "testtag",
                firstColor: "000000",
                secondColor: "ffffff",
                owner: userId,
            })

            const tags = await controller.list()

            expect(tags.some((tagObj) => tagObj.name === "testtag")).to.be.true
        })
    })

    afterEach(async () => {
        await Tag.findOneAndDelete({
            name: {
                $in: ["testtag", "othertag"],
            },
        })
    })

    after(async () => {
        await User.findByIdAndDelete(userId)
    })
})
