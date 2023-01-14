/**
 * Colly | tags sidebar component
 */

import { useEffect } from "react"

import { useAppData } from "./context/DataProvider"

function TagsSidebar(props) {
    const [tags, , loadTags] = useAppData()

    useEffect(() => {
        loadTags()
    }, [])

    return (
        <div className="tags-sidebar d-flex flex-column bg-theme-light p-3">
            {tags.map((tag) => {
                return (
                    <div key={tag._id} className="tags-sidebar-tag">
                        <div
                            className="tags-sidebar-col-circle"
                            style={{
                                background: `linear-gradient(to bottom right, #${tag.firstColor}, #${tag.secondColor})`,
                            }}
                        ></div>
                        {tag.name}
                    </div>
                )
            })}
        </div>
    )
}

export default TagsSidebar
