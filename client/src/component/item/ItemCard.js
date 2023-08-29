/**
 * Colly | item card
 */

import { useState, useEffect } from "react"
import { Buffer } from "buffer"
import { toast } from "react-toastify"

import TagList from "./../tag/TagList"

import InternalAPI from "./../../util/InternalAPI"
import { useUserAuth } from "./../context/UserAuthProvider"

import "./ItemCard.css"

function ItemCard({ id, title, description, url, tags, createItemModalRef }) {
    const [accessToken, , displayName] = useUserAuth()

    const [previewImage, setPreviewImage] = useState("")

    const formatUrlText = (url) => {
        const parts = url.split("/")

        if (parts.length < 3) {
            return url
        }

        return parts[2]
    }

    const loadPreviewImage = async () => {
        let resp
        try {
            resp = await fetch(
                `${InternalAPI.API_ENDPOINT}/item/${id}/preview`,
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            )
        } catch (e) {
            return false
        }

        const base64Buffer = Buffer.from(await resp.arrayBuffer()).toString(
            "base64"
        )
        const imgData = `data:${resp.headers["Content-Type"]};base64,${base64Buffer}`

        setPreviewImage(imgData)
    }

    useEffect(() => {
        loadPreviewImage()
    }, [])

    const handleItemEditClick = (e, itemId) => {
        e.preventDefault()

        createItemModalRef.current.setEditId(itemId)
        createItemModalRef.current.open()
    }

    return (
        <div className="card">
            <img
                src={previewImage}
                alt={`${title} preview screenshot`}
                className="card-img-top"
            />
            <div className="card-body">
                <h5 className="card-title">
                    {title}{" "}
                    <a
                        href="#"
                        onClick={(e) => {
                            handleItemEditClick(e, id)
                        }}
                        className="card-edit text-theme-pink"
                    >
                        <i className="bi bi-pencil-square"></i>
                    </a>
                </h5>
                <p className="card-text card-url">{formatUrlText(url)}</p>
                <p className="card-text card-description">{description}</p>
                {tags.length > 0 && (
                    <div className="card-tags">
                        <TagList tags={tags} />
                    </div>
                )}
            </div>
        </div>
    )
}

export default ItemCard
