/**
 * Colly | tag list
 */

import type { TagRes } from "./../../logic/api/tag"
import TagBadge from "./TagBadge"

import "./TagList.css"

type TagListProps = {
    tags: TagRes[]
    clickAction?: (tag: TagRes) => void
}

function TagList({ tags, clickAction }: TagListProps) {
    return (
        <div className="tags-spacing">
            {tags.map((tag) => (
                <TagBadge key={tag._id} tag={tag} clickAction={clickAction} />
            ))}
        </div>
    )
}

export default TagList
