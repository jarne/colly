/**
 * Colly | item pin icon
 */

export default function Pin({ isPinned }) {
    return isPinned ? (
        <i
            className="bi bi-pin-angle-fill"
            aria-label="Pinned (unpin item)"
        ></i>
    ) : (
        <i className="bi bi-pin-angle" aria-label="Unpinned (pin item)"></i>
    )
}
