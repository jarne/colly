/**
 * Colly | item create view component
 */

import { useState, useImperativeHandle, forwardRef } from "react"
import Modal from "react-bootstrap/Modal"
import { toast } from "react-toastify"

import TagList from "./../tag/TagList"

import { useUserAuth } from "./../context/UserAuthProvider"
import { useAppData } from "./../context/DataProvider"
import { createItem, updateItem } from "./../../logic/api/item"

import "./CreateItemModal.css"

const CreateItemModal = forwardRef((props, ref) => {
    const MAX_FILTERED_TAGS = 10

    const [accessToken] = useUserAuth()
    const [tags, , , items, , loadItems] = useAppData()

    const [show, setShow] = useState(false)

    const [editId, setEditId] = useState(null)

    const [itemUrl, setItemUrl] = useState("")
    const [itemName, setItemName] = useState("")
    const [itemDescription, setItemDescription] = useState("")
    const [itemTags, setItemTags] = useState([])

    const [tagSearchStr, setTagSearchStr] = useState("")
    const [filteredTags, setFilteredTags] = useState([])

    useImperativeHandle(ref, () => ({
        open() {
            handleShow()
        },
        setEditId(id) {
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

    const loadEditInput = (id) => {
        for (const item of items) {
            if (item._id === id) {
                setItemUrl(item.url)
                setItemName(item.name)
                setItemDescription(item.description)
                setItemTags(item.tags)
            }
        }
    }

    const handleShow = () => {
        setShow(true)
    }

    const handleClose = () => {
        setShow(false)

        resetInput()
    }

    const handleItemUrlChange = (e) => {
        setItemUrl(e.target.value)
    }
    const handleItemNameChange = (e) => {
        setItemName(e.target.value)
    }
    const handleItemDescriptionChange = (e) => {
        setItemDescription(e.target.value)
    }
    const handleTagSearchStrChange = (e) => {
        const val = e.target.value

        setTagSearchStr(val)
        setFilteredTags(
            tags
                .filter((tag) => tag.name.includes(val))
                .slice(0, MAX_FILTERED_TAGS)
        )
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            editId
                ? await updateItem(
                      editId,
                      itemUrl,
                      itemName,
                      itemDescription,
                      itemTags,
                      accessToken
                  )
                : await createItem(
                      itemUrl,
                      itemName,
                      itemDescription,
                      itemTags,
                      accessToken
                  )
        } catch (ex) {
            toast.error(ex.message)

            return
        }

        toast.success(
            editId
                ? "Item has been updated!"
                : `Item "${itemName}" has been created!`
        )
        handleClose()

        loadItems()
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
                        <label htmlFor="itemUrlInput" className="form-label">
                            Item URL
                        </label>
                        <input
                            type="url"
                            className="form-control"
                            id="itemUrlInput"
                            placeholder="https://example.com/page-123"
                            value={itemUrl}
                            onChange={handleItemUrlChange}
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="itemNameInput" className="form-label">
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
                    <div className="mb-3">
                        <label
                            htmlFor="itemTagSearchInput"
                            className="form-label"
                        >
                            Associated tags
                        </label>
                        <div className="tag-association-space">
                            <TagList tags={itemTags} />
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
                            <TagList tags={filteredTags} />
                        </div>
                    </div>
                </div>
                <div className="modal-footer">
                    <button
                        type="button"
                        className="btn btn-theme-light"
                        onClick={handleClose}
                    >
                        Cancel
                    </button>
                    <button type="submit" className="btn btn-theme-pink">
                        {editId ? "Edit" : "Create"}
                    </button>
                </div>
            </form>
        </Modal>
    )
})

export default CreateItemModal
