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
            <nav className="navbar bg-theme-light mb-3">
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
            <div className="container-fluid row">
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
        </>
    )
}

export default Dashboard
