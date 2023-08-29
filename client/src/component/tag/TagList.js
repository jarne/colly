/**
 * Colly | tag list
 */

import TagBadge from "./TagBadge"

import "./TagList.css"

function TagList({ tags, clickAction }) {
    return (
        <div className="tags-spacing">
            {tags.map((tag) => (
                <TagBadge
                    key={tag._id}
                    name={tag.name}
                    firstColor={tag.firstColor}
                    secondColor={tag.secondColor}
                    clickAction={clickAction}
                />
            ))}
        </div>
    )
}

export default TagList
