/**
 * Colly | dashboard page
 */

import { useEffect, useRef } from "react"
import { useNavigate, Link } from "react-router-dom"
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry"

import TagsSidebar from "./../component/tag/TagsSidebar"
import ItemCard from "./../component/item/ItemCard"

import CreateTagModal from "./../component/modal/CreateTagModal"
import CreateItemModal from "./../component/modal/CreateItemModal"

import { useUserAuth } from "./../component/context/UserAuthProvider"
import { useAppData } from "./../component/context/DataProvider"

import collyLogoImg from "./../asset/colly-logo.png"

import "./Dashboard.css"

function Dashboard() {
    const navigate = useNavigate()

    const [accessToken, setAccessToken, displayName, setDisplayName] =
        useUserAuth()
    const [, , , items, , loadItems] = useAppData()

    const createTagModalRef = useRef()
    const createItemModalRef = useRef()

    const handleCreateTag = (e) => {
        e.preventDefault()

        createTagModalRef.current.open()
    }
    const handleCreateItem = (e) => {
        e.preventDefault()

        createItemModalRef.current.open()
    }

    const handleLogoutClick = (e) => {
        e.preventDefault()

        setAccessToken(null)
        setDisplayName("...")

        navigate("/login")
    }

    useEffect(() => {
        if (accessToken === null) {
            navigate("/login")

            return
        }

        loadItems()
    }, [accessToken])

    return (
        <>
            <nav className="navbar navbar-expand-lg sticky-top bg-theme-light">
                <div className="container-fluid">
                    <Link className="navbar-brand" to="/dashboard">
                        <img
                            src={collyLogoImg}
                            alt=""
                            width={24}
                            height={24}
                            className="d-inline-block align-text-top me-1"
                        />
                        Colly
                    </Link>
                    <ul className="navbar-nav">
                        <li className="nav-item dropdown">
                            <button
                                className="nav-link dropdown-toggle"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                            >
                                <i className="bi bi-plus-lg"></i> Add
                            </button>
                            <ul className="dropdown-menu dropdown-menu-end position-absolute">
                                <li>
                                    <button
                                        className="dropdown-item"
                                        onClick={handleCreateItem}
                                    >
                                        Collection item
                                    </button>
                                </li>
                                <li>
                                    <button
                                        className="dropdown-item"
                                        onClick={handleCreateTag}
                                    >
                                        Tag
                                    </button>
                                </li>
                            </ul>
                        </li>
                        <li className="nav-item dropdown">
                            <button
                                className="nav-link dropdown-toggle"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                            >
                                {displayName}
                            </button>
                            <ul className="dropdown-menu dropdown-menu-end position-absolute">
                                <li>
                                    <button className="dropdown-item">
                                        Preferences
                                    </button>
                                </li>
                                <li>
                                    <button
                                        className="dropdown-item"
                                        onClick={handleLogoutClick}
                                    >
                                        Logout
                                    </button>
                                </li>
                            </ul>
                        </li>
                    </ul>
                </div>
            </nav>
            <main className="dashboard-main">
                <TagsSidebar createTagModalRef={createTagModalRef} />
                <ResponsiveMasonry className="w-100 m-3 main-cards-view">
                    <Masonry gutter="16px">
                        {items.map((item) => {
                            return (
                                <ItemCard
                                    key={item._id}
                                    item={item}
                                    createItemModalRef={createItemModalRef}
                                />
                            )
                        })}
                    </Masonry>
                </ResponsiveMasonry>
            </main>
            <CreateTagModal ref={createTagModalRef} />
            <CreateItemModal ref={createItemModalRef} />
        </>
    )
}

export default Dashboard
