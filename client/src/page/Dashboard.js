/**
 * Colly | dashboard page
 */

import { toast } from "react-toastify"

import ItemCard from "./../component/ItemCard"

import InternalAPI from "./../util/InternalAPI"
import { useAccessToken } from "./../component/AccessTokenProvider"

import collyLogoImg from "./../asset/colly-logo.png"

import "./Dashboard.css"

function Dashboard() {
    const [accessToken, , displayName] = useAccessToken()

    return (
        <>
            <nav className="navbar bg-theme-light">
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
                                {displayName}
                            </a>
                            <ul className="dropdown-menu dropdown-menu-end position-absolute">
                                <li>
                                    <a className="dropdown-item" href="#">
                                        Preferences
                                    </a>
                                </li>
                                <li>
                                    <a className="dropdown-item" href="#">
                                        Logout
                                    </a>
                                </li>
                            </ul>
                        </li>
                    </ul>
                </div>
            </nav>
            <main className="dashboard-main">
                <div className="tags-sidebar d-flex flex-column bg-theme-light p-3">
                    <div className="tags-sidebar-tag">
                        <div className="tags-sidebar-col-circle bg-theme-orange"></div>
                        Tag 1
                    </div>
                    <div className="tags-sidebar-tag">
                        <div className="tags-sidebar-col-circle bg-theme-pink"></div>
                        Tag 2
                    </div>
                </div>
                <div className="row w-100 m-3">
                    <div className="col-4">
                        <ItemCard />
                    </div>
                    <div className="col-4">
                        <ItemCard />
                    </div>
                    <div className="col-4">
                        <ItemCard />
                    </div>
                </div>
            </main>
        </>
    )
}

export default Dashboard
