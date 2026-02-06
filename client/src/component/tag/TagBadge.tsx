/**
 * Colly | tag badge
 */

import type { TagRes } from "./../../logic/api/tag"
import { type MouseEvent } from "react"

import "./TagBadge.css"

type TagBadgeProps = {
    tag: TagRes
    clickAction?: (tag: TagRes) => void
}

function TagBadge({ tag, clickAction }: TagBadgeProps) {
    const handleClick = (e: MouseEvent<HTMLSpanElement>) => {
        e.preventDefault()

        if (clickAction === undefined) {
            return
        }

        clickAction(tag)
    }

    return (
        <span
            className="badge tag-badge"
            style={{
                background: `linear-gradient(to bottom right, #${tag.firstColor}, #${tag.secondColor})`,
            }}
            role={clickAction ? "button" : undefined}
            onClick={handleClick}
        >
            {tag.name}
        </span>
    )
}

export default TagBadge
