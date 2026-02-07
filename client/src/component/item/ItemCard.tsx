/**
 * Colly | item card
 */

import { type MouseEvent, type RefObject } from "react"
import Dropdown from "react-bootstrap/Dropdown"
import { toast } from "react-toastify"
import usePrefersColorScheme from "use-prefers-color-scheme"
import { useCurrentInput } from "../context/CurrentInputProvider"
import type { ItemRes } from "./../../logic/api/item"
import { updateItem, updateMetaImage } from "./../../logic/api/item"
import type { TagRes } from "./../../logic/api/tag"
import { useUserAuth } from "./../context/UserAuthProvider"
import TagList from "./../tag/TagList"
import Pin from "./Pin"

import "./ItemCard.css"

type EditModalHandle = {
    open: () => void
    setEditId: (id: string) => void
}

type ItemCardProps = {
    item: ItemRes
    createItemModalRef: RefObject<EditModalHandle | null>
    triggerItemLoad: () => Promise<void>
}

function ItemCard({
    item,
    createItemModalRef,
    triggerItemLoad,
}: ItemCardProps) {
    const prefersColorScheme = usePrefersColorScheme()
    const isDarkMode = prefersColorScheme === "dark"

    const { accessToken } = useUserAuth()
    const { isEditMode, workspace } = useCurrentInput()

    const formatUrlText = (url: string) => {
        const parts = url.split("/")

        if (parts.length < 3) {
            return url
        }

        return parts[2]
    }

    const handleItemLinkClick = (
        e: MouseEvent<HTMLAnchorElement>,
        itemId: string
    ) => {
        if (!isEditMode) {
            return
        }

        handleItemEditClick(e, itemId)
    }
    const handleItemEditClick = (
        e: MouseEvent<HTMLElement>,
        itemId: string
    ) => {
        e.preventDefault()

        createItemModalRef.current?.setEditId(itemId)
        createItemModalRef.current?.open()
    }
    const handleItemPinClick = async (item: ItemRes) => {
        try {
            await updateItem(
                item._id,
                {
                    isPinned: !item.isPinned,
                },
                workspace,
                accessToken
            )
        } catch (ex) {
            if (ex instanceof Error) toast.error(ex.message)

            return
        }
        toast.success(`Item ${!item.isPinned ? "pinned" : "unpinned"}!`)

        triggerItemLoad()
    }
    const handleItemUpdateMetaImageClick = async (
        e: MouseEvent<HTMLElement>,
        itemId: string
    ) => {
        e.preventDefault()

        try {
            await updateMetaImage(itemId, workspace, accessToken)
        } catch (ex) {
            if (ex instanceof Error) toast.error(ex.message)

            return
        }

        toast.success(
            "Re-crawling for item meta data image has been requested!"
        )
    }

    return (
        <div className="card">
            <div className="pin-icon" onClick={() => handleItemPinClick(item)}>
                <Pin isPinned={item.isPinned} />
            </div>
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
                            variant={
                                isDarkMode ? "outline-light" : "outline-dark"
                            }
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
                            <Dropdown.Item
                                onClick={() => handleItemPinClick(item)}
                            >
                                {item.isPinned ? "Unpin" : "Pin"}
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
                {item.tags.length > 0 && (
                    <TagList tags={item.tags as TagRes[]} />
                )}
            </div>
        </div>
    )
}

export default ItemCard
