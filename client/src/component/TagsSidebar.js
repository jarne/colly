/**
 * Colly | tags sidebar component
 */

import { useState, useEffect } from "react"
import { toast } from "react-toastify"

import InternalAPI from "./../util/InternalAPI"
import { useAccessToken } from "./../component/AccessTokenProvider"

function TagsSidebar(props) {
    const [accessToken] = useAccessToken()

    const [tags, setTags] = useState([])

    const loadTags = async () => {
        let res
        try {
            const resp = await fetch(InternalAPI.API_ENDPOINT + "/tag", {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            })
            res = await resp.json()
        } catch (e) {
            return false
        }

        if (res.error) {
            return false
        }

        setTags(res.tags)
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
