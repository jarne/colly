/**
 * Colly | stand-alone static test pages server
 */

import express from "express"

const TEST_DATA_PATH = "./test-data"
const TEST_DATA_SERVER_PORT = 3387

const app = express()

app.use(express.static(TEST_DATA_PATH))
app.listen(TEST_DATA_SERVER_PORT)
