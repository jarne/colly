/**
 * Colly | app navigation bar
 */

import { useEffect } from "react"
import { useNavigate, Link } from "react-router-dom"
import usePrefersColorScheme from "use-prefers-color-scheme"
import OverlayTrigger from "react-bootstrap/OverlayTrigger"
import Popover from "react-bootstrap/Popover"
import { toast } from "react-toastify"

import { useUserAuth } from "./../../component/context/UserAuthProvider"
import { useCurrentInput } from "./../../component/context/CurrentInputProvider"
import { getMe, logout } from "./../../logic/api/auth"
import ItemSearch from "./ItemSearch"
import SortSelect from "./SortSelect"
import collyLogoImg from "./../../asset/colly-logo.png"

import "./Navbar.css"

function Navbar({
    createTagModalRef,
    createItemModalRef,
    preferencesModalRef,
}) {
    const navigate = useNavigate()

    const prefersColorScheme = usePrefersColorScheme()
    const isDarkMode = prefersColorScheme === "dark"

    const [
        accessToken,
        setAccessToken,
        displayName,
        setDisplayName,
        isAdmin,
        setIsAdmin,
    ] = useUserAuth()
    const [, , , setSearchStr] = useCurrentInput()

    /**
     * Check if user information is available due to previous authentication,
     * otherwise, fetch it from the API endpoint
     */
    const checkUserInfoAvailable = async () => {
        if (displayName !== "...") {
            return
        }

        let user
        try {
            user = await getMe(accessToken)
        } catch {
            return
        }

        setDisplayName(user.username)
        setIsAdmin(user.isAdmin)
    }

    const doLogout = async () => {
        try {
            await logout(accessToken)
        } catch {
            toast.error("Log-out on server failed!")
            return
        }

        setAccessToken(null)
        setDisplayName("...")
        setIsAdmin(false)

        navigate("/login")
    }

    const handleCreateTag = (e) => {
        e.preventDefault()

        createTagModalRef.current.open()
    }
    const handleCreateItem = (e) => {
        e.preventDefault()

        createItemModalRef.current.open()
    }
    const handlePreferences = (e) => {
        e.preventDefault()

        preferencesModalRef.current.open()
    }

    const handleLogoutClick = (e) => {
        e.preventDefault()

        doLogout()
    }

    useEffect(() => {
        checkUserInfoAvailable()
    }, [])

    return (
        <nav
            className={`navbar navbar-expand sticky-top ${isDarkMode ? "bg-dark" : "bg-light"} bg-blur`}
        >
            <div className="container-fluid">
                <Link className="navbar-brand" to="/">
                    <img
                        src={collyLogoImg}
                        alt=""
                        width={24}
                        height={24}
                        className="d-inline-block align-text-top me-1"
                    />
                    Colly
                </Link>
                <div className="d-flex">
                    <div className="d-none d-md-block">
                        {createTagModalRef && createItemModalRef && (
                            <div className="d-flex">
                                <ItemSearch setSearchStr={setSearchStr} />
                                <SortSelect />
                            </div>
                        )}
                    </div>
                    <ul className="navbar-nav">
                        {createTagModalRef && createItemModalRef && (
                            <>
                                <OverlayTrigger
                                    trigger="click"
                                    placement="bottom"
                                    overlay={
                                        <Popover>
                                            <Popover.Body>
                                                <div className="mb-2">
                                                    <ItemSearch
                                                        setSearchStr={
                                                            setSearchStr
                                                        }
                                                    />
                                                </div>
                                                <SortSelect />
                                            </Popover.Body>
                                        </Popover>
                                    }
                                >
                                    <li className="nav-item d-md-none">
                                        <a className="nav-link">
                                            <i
                                                className="bi bi-search"
                                                aria-hidden="true"
                                            ></i>{" "}
                                            Search
                                        </a>
                                    </li>
                                </OverlayTrigger>
                                <li className="nav-item dropdown">
                                    <button
                                        className="nav-link dropdown-toggle"
                                        data-bs-toggle="dropdown"
                                        aria-expanded="false"
                                    >
                                        <i
                                            className="bi bi-plus-lg"
                                            aria-hidden="true"
                                        ></i>{" "}
                                        Add
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
                            </>
                        )}
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
                                    <button
                                        className="dropdown-item"
                                        onClick={handlePreferences}
                                    >
                                        Preferences
                                    </button>
                                </li>
                                {isAdmin && (
                                    <li>
                                        <Link
                                            className="dropdown-item"
                                            to="/admin"
                                        >
                                            Admin panel
                                        </Link>
                                    </li>
                                )}
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
            </div>
        </nav>
    )
}

export default Navbar
