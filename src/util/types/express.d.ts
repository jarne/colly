/**
 * Colly | express request user type
 */

import "express"

declare global {
    namespace Express {
        interface User {
            id: string
            username: string
            isAdmin: boolean
        }
    }
}
