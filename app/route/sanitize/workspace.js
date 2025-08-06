/**
 * Colly | workspace query sanitization
 */

import * as z from "zod"

const filterSchema = z.object({
    name: z.string().optional(),
})

const populateSchema = z
    .object({
        path: z.literal("members.user"),
        select: z.literal("username"),
    })
    .optional()

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
