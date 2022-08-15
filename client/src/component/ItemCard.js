/**
 * Colly | item card
 */

import { useState, useEffect } from "react"
import { Buffer } from "buffer"
import { toast } from "react-toastify"

import InternalAPI from "./../util/InternalAPI"
import { useAccessToken } from "./../component/AccessTokenProvider"

import "./ItemCard.css"

function ItemCard({ id, title, description, url, tags }) {
    const [accessToken, , displayName] = useAccessToken()

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

    return (
        <div className="card">
            <img
                src={previewImage}
                alt={`${title} preview screenshot`}
                className="card-img-top"
            />
            <div className="card-body">
                <h5 className="card-title">{title}</h5>
                <p className="card-text card-url">{formatUrlText(url)}</p>
                <p className="card-text card-description">{description}</p>
                <p className="card-tags">
                    <span className="badge bg-theme-orange">Tag 1</span>{" "}
                    <span className="badge bg-theme-pink">Tag 2</span>
                </p>
            </div>
        </div>
    )
}

export default ItemCard
