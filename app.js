/**
 * Colly | app server listen file
 */

import app from "./appInit.js"

/* Server listen */

app.listen(process.env.PORT || 3000)

console.log("🚀 App is running!")
