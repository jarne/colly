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
        <a href={clickAction ? "#" : undefined} onClick={handleClick}>
            <span
                className="badge tag-badge"
                style={{
                    background: `linear-gradient(to bottom right, #${tag.firstColor}, #${tag.secondColor})`,
                }}
            >
                {tag.name}
            </span>
        </a>
    )
}

export default TagBadge
