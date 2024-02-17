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
            username: "test-ctrl-tag-savvy_surfer77",
            password: "Qwerty12345!",
        })
        userId = createdUser.id
    })

    describe("#create", () => {
        it("should create a new tag", async () => {
            const tag = await controller.create({
                name: "test-ctrl-tag-introduction-to-ai",
                firstColor: "ff5733",
                secondColor: "ffd700",
                owner: userId,
            })

            expect(tag.id).to.be.not.null
            expect(tag.name).to.equal("test-ctrl-tag-introduction-to-ai")
        })

        it("throws error with invalid tag name", async () => {
            try {
                await controller.create({
                    name: "test-ctrl-tag-web-design !tips?",
                    firstColor: "8a2be2",
                    secondColor: "00ff00",
                    owner: userId,
                })
            } catch (e) {
                expect(e.name).to.equal("ValidationError")
            }
        })

        it("throws error with invalid color", async () => {
            try {
                await controller.create({
                    name: "test-ctrl-tag-healthy-eating-habits",
                    firstColor: "80x00k",
                    secondColor: "ff6347",
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
                name: "test-ctrl-tag-travel-destinations-guide",
                firstColor: "00bfff",
                secondColor: "ff1493",
                owner: userId,
            })

            expect(tag.name).to.equal("test-ctrl-tag-travel-destinations-guide")

            const updatedTag = await controller.update(tag.id, {
                name: "test-ctrl-tag-mindfulness-meditation",
                firstColor: "9932cc",
                secondColor: "ff4500",
                owner: userId,
            })

            expect(updatedTag.name).to.equal(
                "test-ctrl-tag-mindfulness-meditation"
            )
        })

        it("throws error for non-existing tag", async () => {
            try {
                await controller.update("6675932d4f2094eb2ec739ad", {
                    name: "test-ctrl-tag-coding-best-practices",
                    firstColor: "ff8c00",
                    secondColor: "8fbc8f",
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
                name: "test-ctrl-tag-financial-planning-tips",
                firstColor: "2e8b57",
                secondColor: "ba55d3",
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
                name: "test-ctrl-tag-beginner-yoga-poses",
                firstColor: "1e90ff",
                secondColor: "ffd700",
                owner: userId,
            })

            const tags = await controller.list()

            expect(
                tags.some(
                    (tagObj) =>
                        tagObj.name === "test-ctrl-tag-beginner-yoga-poses"
                )
            ).to.be.true
        })
    })

    afterEach(async () => {
        await Tag.findOneAndDelete({
            name: /^test-ctrl-tag-.*/,
        })
    })

    after(async () => {
        await User.findByIdAndDelete(userId)
    })
})
