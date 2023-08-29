/**
 * Colly | tag badge
 */

import "./TagBadge.css"

function TagBadge({
    name,
    firstColor,
    secondColor,
    clickAction,
    deleteAction,
}) {
    return (
        <span
            className="badge"
            style={{
                background: `linear-gradient(to bottom right, #${firstColor}, #${secondColor})`,
            }}
        >
            {name}
        </span>
    )
}

export default TagBadge
