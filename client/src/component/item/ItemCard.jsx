/**
 * Colly | item card
 */

import Dropdown from "react-bootstrap/Dropdown"
import { toast } from "react-toastify"

import TagList from "./../tag/TagList"
import { useUserAuth } from "./../context/UserAuthProvider"
import { useCurrentInput } from "./../context/CurrentInputProvider"
import { updateMetaImage } from "./../../logic/api/item"

import "./ItemCard.css"

function ItemCard({ item, createItemModalRef }) {
    const [accessToken] = useUserAuth()
    const [, , , , , , isEditMode] = useCurrentInput()

    const formatUrlText = (url) => {
        const parts = url.split("/")

        if (parts.length < 3) {
            return url
        }

        return parts[2]
    }

    const handleItemLinkClick = (e, itemId) => {
        if (!isEditMode) {
            return
        }

        handleItemEditClick(e, itemId)
    }
    const handleItemEditClick = (e, itemId) => {
        e.preventDefault()

        createItemModalRef.current.setEditId(itemId)
        createItemModalRef.current.open()
    }
    const handleItemUpdateMetaImageClick = async (e, itemId) => {
        e.preventDefault()

        try {
            await updateMetaImage(itemId, accessToken)
        } catch (ex) {
            toast.error(ex.message)

            return
        }

        toast.success(
            "Re-crawling for item meta data image has been requested!"
        )
    }

    return (
        <div className="card">
            {item.imageUrl && (
                <img
                    src={item.imageUrl}
                    alt={`${item.name} article image`}
                    className="card-img-top"
                />
            )}
            <div className="card-body">
                <h5 className="card-title">
                    <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-reset text-decoration-none"
                        onClick={(e) => {
                            handleItemLinkClick(e, item._id)
                        }}
                    >
                        {item.logoUrl && (
                            <img
                                src={item.logoUrl}
                                alt={`${item.name} page icon`}
                                className="card-logo-img rounded-circle"
                            />
                        )}{" "}
                        {item.name}
                    </a>
                </h5>
                <div className="d-flex justify-content-between">
                    <p className="card-text card-url">
                        <a
                            href={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-reset text-decoration-none"
                            onClick={(e) => {
                                handleItemLinkClick(e, item._id)
                            }}
                        >
                            {formatUrlText(item.url)}
                        </a>
                    </p>
                    <Dropdown>
                        <Dropdown.Toggle
                            variant="outline-dark"
                            className="btn-sm card-edit"
                        >
                            <i
                                className="bi bi-three-dots"
                                aria-label="Item actions"
                            ></i>
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Item
                                onClick={(e) => {
                                    handleItemEditClick(e, item._id)
                                }}
                            >
                                Edit
                            </Dropdown.Item>
                            <Dropdown.Divider />
                            <Dropdown.Item
                                onClick={(e) => {
                                    handleItemUpdateMetaImageClick(e, item._id)
                                }}
                            >
                                Re-crawl image
                            </Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </div>
                <p className="card-text card-description">{item.description}</p>
                {item.tags.length > 0 && <TagList tags={item.tags} />}
            </div>
        </div>
    )
}

export default ItemCard
