/**
 * Colly | tags sidebar component
 */

import { useState, useEffect } from "react"
import { toast } from "react-toastify"

import { useUserAuth } from "./context/UserAuthProvider"
import { listTags } from "./../logic/api/tag"

function TagsSidebar(props) {
    const [accessToken] = useUserAuth()

    const [tags, setTags] = useState([])

    const loadTags = async () => {
        let tags
        try {
            tags = await listTags(accessToken)
        } catch (e) {
            return
        }

        setTags(tags)
    }

    useEffect(() => {
        loadTags()
    }, [props.tagsRefresh])

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
