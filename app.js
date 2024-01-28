/**
 * Colly | app server listen file
 */

import app from "./appInit.js"
import logger from "./app/util/logger.js"

/* Server listen */

app.listen(process.env.PORT || 3000)

logger.info("🚀 App is running")
