/**
 * Colly | tag create view component
 */

import { useState, useRef } from "react"
import { HexColorPicker } from "react-colorful"
import { toast } from "react-toastify"

import InternalAPI from "./../../util/InternalAPI"
import { useAccessToken } from "./../../component/AccessTokenProvider"

import "./CreateTagModal.css"

function CreateTagModal(props) {
    const [accessToken] = useAccessToken()

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

        let res
        try {
            const resp = await fetch(InternalAPI.API_ENDPOINT + "/tag", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: tagName,
                    firstColor: colFirst.slice(1),
                    secondColor: colSec.slice(1),
                }),
            })
            res = await resp.json()
        } catch (e) {
            toast.error("Error while communicating with the login server!")
            modalCloseRef.current.click()

            return
        }

        if (res.error) {
            switch (res.error_code) {
                case "invalid_credentials":
                    toast.error("Invalid username or password!") // TODO: change error codes
                    break
                default:
                    toast.error("Unknown error!")
                    break
            }

            modalCloseRef.current.click()
            return
        }

        toast.success(`Tag "${tagName}" has been created!`)
        modalCloseRef.current.click()

        props.doTagsRefresh()
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
                                    placeholder="coolpartiesat22"
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
