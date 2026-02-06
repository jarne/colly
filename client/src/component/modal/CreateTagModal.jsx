/**
 * Colly | tag create view component
 */

import { useState, useImperativeHandle, forwardRef } from "react"
import Modal from "react-bootstrap/Modal"
import { HexColorPicker } from "react-colorful"
import { useClickAway } from "@uidotdev/usehooks"
import { toast } from "react-toastify"

import { useUserAuth } from "./../context/UserAuthProvider"
import { useAppData } from "./../context/DataProvider"
import { useCurrentInput } from "../context/CurrentInputProvider"
import { createTag, updateTag, deleteTag } from "./../../logic/api/tag"
import { generateGradientColors } from "./../../util/ColorGenerator"

import "./CreateTagModal.css"

const CreateTagModal = forwardRef(function CreateTagModal(props, ref) {
    const DEFAULT_EMPTY = ""
    const DEFAULT_OPEN = false

    const DEFAULT_COL_FIRST = "#000000"
    const DEFAULT_COL_SEC = "#ffffff"

    const { accessToken } = useUserAuth()
    const { tags, loadTags } = useAppData()
    const { workspace } = useCurrentInput()

    const [show, setShow] = useState(false)

    const [editId, setEditId] = useState(null)

    const [isColFirstOpen, setColFirstOpen] = useState(DEFAULT_OPEN)
    const [isColSecOpen, setColSecOpen] = useState(DEFAULT_OPEN)

    const [tagName, setTagName] = useState(DEFAULT_EMPTY)

    const [colFirst, setColFirst] = useState(DEFAULT_COL_FIRST)
    const [colSec, setColSec] = useState(DEFAULT_COL_SEC)

    const refFirst = useClickAway(() => {
        setColFirstOpen(false)
    })
    const refSec = useClickAway(() => {
        setColSecOpen(false)
    })

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
        setColFirstOpen(DEFAULT_OPEN)
        setColSecOpen(DEFAULT_OPEN)
        setTagName(DEFAULT_EMPTY)
        setColFirst(DEFAULT_COL_FIRST)
        setColSec(DEFAULT_COL_SEC)
    }

    const loadEditInput = (id) => {
        for (const tag of tags) {
            if (tag._id === id) {
                setTagName(tag.name)
                setColFirst(`#${tag.firstColor}`)
                setColSec(`#${tag.secondColor}`)
            }
        }
    }

    const suggestColors = () => {
        const colors = generateGradientColors()

        if (colFirst === DEFAULT_COL_FIRST && colSec === DEFAULT_COL_SEC) {
            setColFirst(colors[0])
            setColSec(colors[1])
        }
    }

    const handleShow = () => {
        setShow(true)
    }

    const handleClose = () => {
        setShow(false)

        resetInput()
    }

    const toggleColFirstOpen = () => {
        setColFirstOpen(!isColFirstOpen)
    }

    const toggleColSecOpen = () => {
        setColSecOpen(!isColSecOpen)
    }

    const handleTagNameChange = (e) => {
        setTagName(e.target.value)
    }
    const handleTagNameBlur = () => {
        suggestColors()
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            if (editId) {
                await updateTag(
                    editId,
                    {
                        name: tagName,
                        firstColor: colFirst.slice(1),
                        secondColor: colSec.slice(1),
                    },
                    workspace,
                    accessToken
                )
            } else {
                await createTag(
                    {
                        name: tagName,
                        firstColor: colFirst.slice(1),
                        secondColor: colSec.slice(1),
                    },
                    workspace,
                    accessToken
                )
            }
        } catch (ex) {
            toast.error(ex.message)

            return
        }

        toast.success(
            editId
                ? "Tag has been updated!"
                : `Tag "${tagName}" has been created!`
        )
        handleClose()

        loadTags()
    }

    const handleDelete = async (e) => {
        e.preventDefault()

        try {
            await deleteTag(editId, workspace, accessToken)
        } catch (ex) {
            toast.error(ex.message)

            return
        }

        toast.success("Tag has been deleted!")
        handleClose()

        loadTags()
    }

    return (
        <Modal show={show} onHide={handleClose}>
            <div className="modal-header">
                <h1 className="modal-title fs-5" id="createTagModalLabel">
                    {editId ? `Edit tag` : "Create new tag"}
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
                        <label htmlFor="tagNameInput" className="form-label">
                            Tag name
                        </label>
                        <input
                            type="text"
                            className="form-control"
                            id="tagNameInput"
                            placeholder="tag-name-123"
                            value={tagName}
                            onChange={handleTagNameChange}
                            onBlur={handleTagNameBlur}
                            autoFocus
                        />
                    </div>
                    <div className="mb-3">
                        <label
                            htmlFor="tagColorsSection"
                            className="form-label"
                        >
                            Color
                        </label>
                        <div id="tagColorsSection">
                            <div
                                className="col-display"
                                style={{
                                    backgroundColor: colFirst,
                                }}
                                onClick={toggleColFirstOpen}
                            ></div>
                            <div
                                className="col-display"
                                style={{
                                    backgroundColor: colSec,
                                }}
                                onClick={toggleColSecOpen}
                            ></div>
                        </div>
                        {isColFirstOpen && (
                            <div ref={refFirst} className="col-picker-pop">
                                <HexColorPicker
                                    color={colFirst}
                                    onChange={setColFirst}
                                />
                            </div>
                        )}
                        {isColSecOpen && (
                            <div ref={refSec} className="col-picker-pop">
                                <HexColorPicker
                                    color={colSec}
                                    onChange={setColSec}
                                />
                            </div>
                        )}
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
})

export default CreateTagModal
