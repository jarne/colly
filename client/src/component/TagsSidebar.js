/**
 * Colly | tags sidebar component
 */

import { useEffect, useState } from "react"

import { useAppData } from "./context/DataProvider"

import "./TagsSidebar.css"

function TagsSidebar(props) {
    const [tags, , loadTags] = useAppData()

    const [isEditMode, setEditMode] = useState(false)

    useEffect(() => {
        loadTags()
    }, [])

    const handleEditModeChange = (e) => {
        setEditMode(!isEditMode)
    }

    const handleTagClick = (e, tagId) => {
        e.preventDefault()

        if (isEditMode) {
            props.createTagModalRef.current.setEditId(tagId)
            props.createTagModalRef.current.open()

            return
        }

        // TODO: open tag page
    }

    return (
        <div className="tags-sidebar d-flex flex-column bg-theme-light p-3">
            {tags.map((tag) => {
                return (
                    <a
                        key={tag._id}
                        className="tags-sidebar-tag text-theme-dark text-decoration-none"
                        href="#"
                        onClick={(e) => {
                            handleTagClick(e, tag._id)
                        }}
                    >
                        <div
                            className="tags-sidebar-col-circle"
                            style={{
                                background: `linear-gradient(to bottom right, #${tag.firstColor}, #${tag.secondColor})`,
                            }}
                        ></div>
                        {tag.name}
                    </a>
                )
            })}
            <div className="form-check tags-edit-mode-check">
                <input
                    type="checkbox"
                    className="form-check-input"
                    id="editModeCheck"
                    checked={isEditMode}
                    onChange={handleEditModeChange}
                />
                <label className="form-check-label" htmlFor="editModeCheck">
                    Edit mode
                </label>
            </div>
        </div>
    )
}

export default TagsSidebar
