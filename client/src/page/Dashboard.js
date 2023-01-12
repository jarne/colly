/**
 * Colly | dashboard page
 */

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"

import TagsSidebar from "./../component/TagsSidebar"
import ItemCard from "./../component/ItemCard"

import CreateTagModal from "./../component/modal/CreateTagModal"

import InternalAPI from "./../util/InternalAPI"
import { useAccessToken } from "./../component/AccessTokenProvider"

import collyLogoImg from "./../asset/colly-logo.png"

import "./Dashboard.css"

function Dashboard() {
    const navigate = useNavigate()
    const [accessToken, setAccessToken, displayName, setDisplayName] =
        useAccessToken()

    const [tagsRefresh, setTagsRefresh] = useState(0)

    const [items, setItems] = useState([])

    const doTagsRefresh = () => {
        setTagsRefresh((p) => p + 1)
    }

    const loadItems = async () => {
        if (accessToken === null) {
            navigate("/login")
        }

        let res
        try {
            const resp = await fetch(InternalAPI.API_ENDPOINT + "/item", {
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

        setItems(res.items)
    }

    const handleLogoutClick = (e) => {
        e.preventDefault()

        setAccessToken(null)
        setDisplayName("...")

        navigate("/login")
    }

    useEffect(() => {
        loadItems()
    }, [])

    return (
        <>
            <nav className="navbar navbar-expand-lg sticky-top bg-theme-light">
                <div className="container-fluid">
                    <a className="navbar-brand" href="#">
                        <img
                            src={collyLogoImg}
                            alt=""
                            width={24}
                            height={24}
                            className="d-inline-block align-text-top me-1"
                        />
                        Colly
                    </a>
                    <ul className="navbar-nav">
                        <li className="nav-item dropdown">
                            <a
                                className="nav-link dropdown-toggle"
                                href="#"
                                role="button"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                            >
                                <i className="bi bi-plus-lg"></i> Add
                            </a>
                            <ul className="dropdown-menu dropdown-menu-end position-absolute">
                                <li>
                                    <a className="dropdown-item" href="#">
                                        Collection item
                                    </a>
                                </li>
                                <li>
                                    <a
                                        className="dropdown-item"
                                        href="#"
                                        data-bs-toggle="modal"
                                        data-bs-target="#createTagModal"
                                    >
                                        Tag
                                    </a>
                                </li>
                            </ul>
                        </li>
                        <li className="nav-item dropdown">
                            <a
                                className="nav-link dropdown-toggle"
                                href="#"
                                role="button"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                            >
                                {displayName}
                            </a>
                            <ul className="dropdown-menu dropdown-menu-end position-absolute">
                                <li>
                                    <a className="dropdown-item" href="#">
                                        Preferences
                                    </a>
                                </li>
                                <li>
                                    <a
                                        className="dropdown-item"
                                        href="#"
                                        onClick={handleLogoutClick}
                                    >
                                        Logout
                                    </a>
                                </li>
                            </ul>
                        </li>
                    </ul>
                </div>
            </nav>
            <main className="dashboard-main">
                <TagsSidebar tagsRefresh={tagsRefresh} />
                <div className="row w-100 m-3">
                    {items.map((item) => {
                        return (
                            <div key={item._id} className="col-4">
                                <ItemCard
                                    id={item._id}
                                    title={item.name}
                                    description={item.description}
                                    url={item.url}
                                    tags={item.tags}
                                />
                            </div>
                        )
                    })}
                </div>
            </main>
            <CreateTagModal doTagsRefresh={doTagsRefresh} />
        </>
    )
}

export default Dashboard
