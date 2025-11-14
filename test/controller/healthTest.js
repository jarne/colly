/**
 * Colly | health controller tests
 */

import { expect } from "chai"

import { connectDbAsync } from "./../../app/init.js"
import controller from "./../../app/controller/health.js"

describe("health controller", () => {
    before(async () => {
        await connectDbAsync()
    })

    describe("#checkServiceStatus", () => {
        it("should report the database connection as healthy", async () => {
            const status = controller.checkServiceStatus()

            expect(status.database).to.equal("ok")
        })
    })
})
