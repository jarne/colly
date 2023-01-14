/**
 * Colly | tag create view component
 */

import { useState, useRef } from "react"
import { HexColorPicker } from "react-colorful"
import { toast } from "react-toastify"

import { useUserAuth } from "./../context/UserAuthProvider"
import { useAppData } from "./../context/DataProvider"
import { createTag } from "./../../logic/api/tag"

import "./CreateTagModal.css"

function CreateTagModal(props) {
    const [accessToken] = useUserAuth()
    const [, , loadTags] = useAppData()

    const [isColFirstOpen, setColFirstOpen] = useState(false)
    const [isColSecOpen, setColSecOpen] = useState(false)

    const modalCloseRef = useRef()

    const [tagName, setTagName] = useState("")

    const [colFirst, setColFirst] = useState("#000000")
    const [colSec, setColSec] = useState("#ffffff")

    const toggleColFirstOpen = () => {
        setColFirstOpen(!isColFirstOpen)
    }

    const toggleColSecOpen = () => {
        setColSecOpen(!isColSecOpen)
    }

    const handleTagNameChange = (e) => {
        setTagName(e.target.value)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            await createTag(
                tagName,
                colFirst.slice(1),
                colSec.slice(1),
                accessToken
            )
        } catch (ex) {
            toast.error(ex.message)

            return
        }

        toast.success(`Tag "${tagName}" has been created!`)
        modalCloseRef.current.click()

        loadTags()
    }

    return (
        <div
            className="modal fade"
            id="createTagModal"
            tabIndex={-1}
            aria-labelledby="createTagModalLabel"
            aria-hidden="true"
        >
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h1
                            className="modal-title fs-5"
                            id="createTagModalLabel"
                        >
                            Create new tag
                        </h1>
                        <button
                            type="button"
                            className="btn-close"
                            data-bs-dismiss="modal"
                            aria-label="Close"
                            ref={modalCloseRef}
                        ></button>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="modal-body">
                            <div className="mb-3">
                                <label
                                    htmlFor="tagNameInput"
                                    className="form-label"
                                >
                                    Tag name
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="tagNameInput"
                                    placeholder="tag-name-123"
                                    value={tagName}
                                    onChange={handleTagNameChange}
                                />
                            </div>
                            <div className="mb-3">
                                <label
                                    htmlFor="tagNameInput"
                                    className="form-label"
                                >
                                    Color
                                </label>
                                <div>
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
                                    <div className="col-picker-pop">
                                        <HexColorPicker
                                            color={colFirst}
                                            onChange={setColFirst}
                                        />
                                    </div>
                                )}
                                {isColSecOpen && (
                                    <div className="col-picker-pop">
                                        <HexColorPicker
                                            color={colSec}
                                            onChange={setColSec}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button
                                type="button"
                                className="btn btn-theme-light"
                                data-bs-dismiss="modal"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="btn btn-theme-pink"
                            >
                                Create
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default CreateTagModal
