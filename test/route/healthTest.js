/**
 * Colly | health router tests
 */

import { expect } from "chai"
import request from "supertest"

import { connectDbAsync } from "./../../dist/init.js"
import app from "./../../dist/appInit.js"

describe("health router", () => {
    before(async () => {
        await connectDbAsync()
    })

    describe("get /api/health", () => {
        it("should report the database status as healthy", async () => {
            const res = await request(app).get("/api/health").send()

            expect(res.status).to.eq(200)
            expect(res.body.database).to.equal("ok")
        })
    })
})
