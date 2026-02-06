/**
 * Colly | run database migrations
 */

import { associateItemsAndTags } from "./itemWorkspaceRelations.js"

export const runMigrations = async () => {
    await associateItemsAndTags()
}
