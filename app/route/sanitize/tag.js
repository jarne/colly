/**
 * Colly | tag query sanitization
 */

import * as z from "zod"

const filterSchema = z.object({
    name: z.string().optional(),
})

const populateSchema = z.object({}).optional()

const sortSchema = z.string().optional()

const selectSchema = z.string().optional()

const limitSchema = z.number().optional()

export default {
    filterSchema,
    populateSchema,
    sortSchema,
    selectSchema,
    limitSchema,
}
