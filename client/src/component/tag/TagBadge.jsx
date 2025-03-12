/**
 * Colly | tag badge
 */

import "./TagBadge.css"

function TagBadge({ tag, clickAction }) {
    const handleClick = (e) => {
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
