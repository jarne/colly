/**
 * Colly | test hooks
 */

import express from "express"

const TEST_DATA_PATH = "./test-data"
const TEST_DATA_SERVER_PORT = 3388

let instance

export const mochaHooks = {
    beforeAll: () => {
        const app = express()

        app.use(express.static(TEST_DATA_PATH))
        instance = app.listen(TEST_DATA_SERVER_PORT)
    },
    afterAll: () => {
        instance.close()
    },
}
