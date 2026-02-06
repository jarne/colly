/**
 * Colly | item create view component
 */

import {
    forwardRef,
    useImperativeHandle,
    useState,
    type ChangeEvent,
    type FocusEvent,
    type MouseEvent,
    type SubmitEvent,
} from "react"
import Modal from "react-bootstrap/Modal"
import { toast } from "react-toastify"
import { useCurrentInput } from "../context/CurrentInputProvider"
import {
    createItem,
    deleteItem,
    generatePreview,
    updateItem,
} from "./../../logic/api/item"
import type { TagRes } from "./../../logic/api/tag"
import { findTags, updateTag } from "./../../logic/api/tag"
import { useAppData } from "./../context/DataProvider"
import { useUserAuth } from "./../context/UserAuthProvider"
import TagList from "./../tag/TagList"

import "./CreateItemModal.css"

type CreateItemModalHandle = {
    open: () => void
    setEditId: (id: string) => void
}

type CreateItemModalProps = {
    triggerItemLoad: () => Promise<void> | void
}

const CreateItemModal = forwardRef<CreateItemModalHandle, CreateItemModalProps>(
    function CreateItemModal(props, ref) {
        const MAX_FILTERED_TAGS = 5

        const { accessToken } = useUserAuth()
        const { items } = useAppData()
        const { workspace } = useCurrentInput()

        const [show, setShow] = useState(false)

        const [editId, setEditId] = useState<string | null>(null)

        const [itemUrl, setItemUrl] = useState("")
        const [itemName, setItemName] = useState("")
        const [itemDescription, setItemDescription] = useState("")
        const [itemTags, setItemTags] = useState<TagRes[]>([])

        const [tagSearchStr, setTagSearchStr] = useState("")
        const [filteredTags, setFilteredTags] = useState<TagRes[]>([])

        const [isFetchingMeta, setIsFetchingMeta] = useState(false)

        useImperativeHandle(ref, () => ({
            open() {
                handleShow()
            },
            setEditId(id: string) {
                setEditId(id)
                loadEditInput(id)
            },
        }))

        const resetInput = () => {
            setEditId(null)
            setItemUrl("")
            setItemName("")
            setItemDescription("")
            setItemTags([])
            setTagSearchStr("")
            setFilteredTags([])
        }

        const loadEditInput = (id: string) => {
            for (const item of items) {
                if (item._id === id) {
                    setItemUrl(item.url)
                    setItemName(item.name)
                    setItemDescription(item.description)
                    setItemTags(item.tags as TagRes[])
                }
            }
        }

        const handleShow = async () => {
            await loadFilteredTags()

            setShow(true)
        }

        const handleClose = () => {
            setShow(false)

            resetInput()
        }

        const handleItemUrlChange = (e: ChangeEvent<HTMLInputElement>) => {
            setItemUrl(e.target.value)
        }
        const handleItemUrlBlur = async (e: FocusEvent<HTMLInputElement>) => {
            if (e.target.value === "") {
                return
            }

            if (itemName !== "" && itemDescription !== "") {
                return
            }

            setIsFetchingMeta(true)

            let meta: Awaited<ReturnType<typeof generatePreview>>
            try {
                meta = await generatePreview(
                    e.target.value,
                    workspace,
                    accessToken
                )
            } catch {
                setIsFetchingMeta(false)
                return
            }

            if (itemName === "") {
                setItemName(meta.title)
            }

            if (itemDescription === "") {
                setItemDescription(meta.description)
            }

            setIsFetchingMeta(false)
        }

        const handleItemNameChange = (e: ChangeEvent<HTMLInputElement>) => {
            setItemName(e.target.value)
        }
        const handleItemDescriptionChange = (
            e: ChangeEvent<HTMLInputElement>
        ) => {
            setItemDescription(e.target.value)
        }
        const handleTagSearchStrChange = async (
            e: ChangeEvent<HTMLInputElement>
        ) => {
            const val = e.target.value

            setTagSearchStr(val)
            await loadFilteredTags(val)
        }

        const loadFilteredTags = async (name = ""): Promise<void> => {
            let foundTags: TagRes[]
            try {
                foundTags = await findTags(
                    {
                        filter: {
                            name: {
                                $regex: name,
                            },
                        },
                        sort: {
                            lastUsed: "desc",
                        },
                        limit: MAX_FILTERED_TAGS,
                    },
                    workspace,
                    accessToken
                )
            } catch (e) {
                if (e instanceof Error) toast.error(e.message)

                return
            }
            setFilteredTags(foundTags)
        }

        const handleTagAdd = async (tag: TagRes) => {
            setItemTags([...itemTags, tag])

            await updateTag(
                tag._id,
                {
                    lastUsed: new Date(),
                },
                workspace,
                accessToken
            )
        }
        const handleTagRemove = (tag: TagRes) => {
            setItemTags(itemTags.filter((val) => val._id !== tag._id))
        }

        const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
            e.preventDefault()

            try {
                if (editId) {
                    await updateItem(
                        editId,
                        {
                            url: itemUrl,
                            name: itemName,
                            description: itemDescription,
                            tags: itemTags,
                        },
                        workspace,
                        accessToken
                    )
                } else {
                    await createItem(
                        {
                            url: itemUrl,
                            name: itemName,
                            description: itemDescription,
                            tags: itemTags,
                        },
                        workspace,
                        accessToken
                    )
                }
            } catch (ex) {
                if (ex instanceof Error) toast.error(ex.message)

                return
            }

            toast.success(
                editId
                    ? "Item has been updated!"
                    : `Item "${itemName}" has been created!`
            )
            handleClose()

            await props.triggerItemLoad()
        }

        const handleDelete = async (e: MouseEvent<HTMLButtonElement>) => {
            e.preventDefault()

            if (editId === null) {
                return
            }

            try {
                await deleteItem(editId, workspace, accessToken)
            } catch (ex) {
                if (ex instanceof Error) toast.error(ex.message)

                return
            }

            toast.success("Item has been deleted!")
            handleClose()

            await props.triggerItemLoad()
        }

        return (
            <Modal show={show} onHide={handleClose}>
                <div className="modal-header">
                    <h1 className="modal-title fs-5" id="createItemModalLabel">
                        {editId ? `Edit item` : "Create new item"}
                    </h1>
                    <button
                        type="button"
                        className="btn-close"
                        data-bs-dismiss="modal"
                        aria-label="Close"
                        onClick={handleClose}
                    ></button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="modal-body">
                        <div className="mb-3">
                            <label
                                htmlFor="itemUrlInput"
                                className="form-label"
                            >
                                Item URL{" "}
                                {isFetchingMeta && (
                                    <div
                                        className="spinner-border spinner-border-sm ms-1"
                                        role="status"
                                    >
                                        <span className="visually-hidden">
                                            Loading...
                                        </span>
                                    </div>
                                )}
                            </label>
                            <input
                                type="url"
                                className="form-control"
                                id="itemUrlInput"
                                placeholder="https://example.com/page-123"
                                value={itemUrl}
                                onChange={handleItemUrlChange}
                                onBlur={handleItemUrlBlur}
                                autoFocus
                            />
                        </div>
                        <div className="mb-3">
                            <a
                                data-bs-toggle="collapse"
                                href="#collapseItemDetails"
                                role="button"
                                aria-expanded="false"
                                aria-controls="collapseItemDetails"
                            >
                                {itemName ? (
                                    <>
                                        {itemName} • {itemDescription}
                                        <i
                                            className="bi bi-pencil-square ms-1"
                                            aria-label="Edit manually"
                                        ></i>
                                    </>
                                ) : (
                                    "Paste an URL or click here to add information manually"
                                )}
                            </a>
                        </div>
                        <div className="collapse" id="collapseItemDetails">
                            <div className="mb-3">
                                <label
                                    htmlFor="itemNameInput"
                                    className="form-label"
                                >
                                    Item name
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="itemNameInput"
                                    placeholder="My cool item"
                                    value={itemName}
                                    onChange={handleItemNameChange}
                                />
                            </div>
                            <div className="mb-3">
                                <label
                                    htmlFor="itemDescriptionInput"
                                    className="form-label"
                                >
                                    Item description
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="itemDescriptionInput"
                                    placeholder="Add a text to describe your item"
                                    value={itemDescription}
                                    onChange={handleItemDescriptionChange}
                                />
                            </div>
                        </div>
                        <div className="mb-3">
                            <label
                                htmlFor="itemTagSearchInput"
                                className="form-label"
                            >
                                Associated tags
                            </label>
                            <div className="tag-association-space">
                                <TagList
                                    tags={itemTags}
                                    clickAction={handleTagRemove}
                                />
                            </div>
                            <div className="tag-association-space">
                                <input
                                    type="text"
                                    className="form-control"
                                    id="itemTagSearchInput"
                                    placeholder="Search for tags"
                                    value={tagSearchStr}
                                    onChange={handleTagSearchStrChange}
                                />
                            </div>
                            <div className="tag-association-space">
                                <TagList
                                    tags={filteredTags}
                                    clickAction={handleTagAdd}
                                />
                            </div>
                        </div>
                    </div>
                    <div
                        className={`modal-footer${editId ? " d-flex justify-content-between" : ""}`}
                    >
                        {editId && (
                            <button
                                type="button"
                                className="btn btn-dark"
                                onClick={handleDelete}
                            >
                                Delete
                            </button>
                        )}
                        <div>
                            <button
                                type="button"
                                className="btn btn-light me-2"
                                onClick={handleClose}
                            >
                                Cancel
                            </button>
                            <button type="submit" className="btn btn-secondary">
                                {editId ? "Edit" : "Create"}
                            </button>
                        </div>
                    </div>
                </form>
            </Modal>
        )
    }
)

export default CreateItemModal
