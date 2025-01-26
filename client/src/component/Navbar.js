/**
 * Colly | app navigation bar
 */

import { useNavigate, Link } from "react-router-dom"
import usePrefersColorScheme from "use-prefers-color-scheme"

import { useUserAuth } from "./../component/context/UserAuthProvider"
import collyLogoImg from "./../asset/colly-logo.png"

function Navbar({ createTagModalRef, createItemModalRef }) {
    const navigate = useNavigate()

    const prefersColorScheme = usePrefersColorScheme()
    const isDarkMode = prefersColorScheme === "dark"

    const [, setAccessToken, displayName, setDisplayName, isAdmin, setIsAdmin] =
        useUserAuth()

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
        setIsAdmin(false)

        navigate("/login")
    }

    return (
        <nav
            className={`navbar navbar-expand-lg sticky-top ${isDarkMode ? "bg-dark" : "bg-light"}`}
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
                <ul className="navbar-nav">
                    {createTagModalRef && createItemModalRef && (
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
                                <button className="dropdown-item">
                                    Preferences
                                </button>
                            </li>
                            {isAdmin && (
                                <li>
                                    <Link className="dropdown-item" to="/admin">
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
        </nav>
    )
}

export default Navbar
