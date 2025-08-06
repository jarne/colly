/**
 * Colly | user query sanitization
 */

import * as z from "zod"

const filterSchema = z.object({
    username: z.string().optional(),
    isAdmin: z.boolean().optional(),
})

const populateSchema = z.object({}).optional()

const sortSchema = z.string().optional()

const selectSchema = z.enum(["username", "isAdmin"]).optional()

const limitSchema = z.number().optional()

export default {
    filterSchema,
    populateSchema,
    sortSchema,
    selectSchema,
    limitSchema,
}
