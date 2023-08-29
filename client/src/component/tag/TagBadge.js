/**
 * Colly | tag badge
 */

import "./TagBadge.css"

function TagBadge({ name, firstColor, secondColor, clickAction }) {
    return (
        <a href={clickAction ? "#" : undefined} onClick={clickAction}>
            <span
                className="badge tag-badge"
                style={{
                    background: `linear-gradient(to bottom right, #${firstColor}, #${secondColor})`,
                }}
            >
                {name}
            </span>
        </a>
    )
}

export default TagBadge
