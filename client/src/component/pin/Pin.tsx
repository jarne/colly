/**
 * Colly | item pin icon
 */

import "./Pin.css"

type PinProps = {
    isPinned: boolean
}

export default function Pin({ isPinned }: PinProps) {
    return isPinned ? (
        <i
            className="bi bi-pin-angle-fill item-pin"
            aria-label="Pinned (unpin item)"
        ></i>
    ) : (
        <i
            className="bi bi-pin-angle item-pin"
            aria-label="Unpinned (pin item)"
        ></i>
    )
}
