/**
 * Colly | item pin icon
 */

type PinProps = {
    isPinned: boolean
}

export default function Pin({ isPinned }: PinProps) {
    return isPinned ? (
        <i
            className="bi bi-pin-angle-fill"
            aria-label="Pinned (unpin item)"
        ></i>
    ) : (
        <i className="bi bi-pin-angle" aria-label="Unpinned (pin item)"></i>
    )
}
