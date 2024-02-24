/**
 * Colly | item card
 */

import TagList from "./../tag/TagList"

import "./ItemCard.css"

function ItemCard({ item, createItemModalRef }) {
    const formatUrlText = (url) => {
        const parts = url.split("/")

        if (parts.length < 3) {
            return url
        }

        return parts[2]
    }

    const handleItemEditClick = (e, itemId) => {
        e.preventDefault()

        createItemModalRef.current.setEditId(itemId)
        createItemModalRef.current.open()
    }

    return (
        <div className="card">
            {item.imageUrl && (
                <img
                    src={item.imageUrl}
                    alt={`${item.name} preview screenshot`}
                    className="card-img-top"
                />
            )}
            <div className="card-body">
                <h5 className="card-title">
                    {item.name}{" "}
                    <button
                        onClick={(e) => {
                            handleItemEditClick(e, item._id)
                        }}
                        className="card-edit bg-transparent border-0 text-theme-pink"
                    >
                        <i className="bi bi-pencil-square"></i>
                    </button>
                </h5>
                <p className="card-text card-url">{formatUrlText(item.url)}</p>
                <p className="card-text card-description">{item.description}</p>
                {item.tags.length > 0 && <TagList tags={item.tags} />}
            </div>
        </div>
    )
}

export default ItemCard
