/**
 * Colly | item card
 */

import { toast } from "react-toastify"

import InternalAPI from "./../util/InternalAPI"
import { useAccessToken } from "./../component/AccessTokenProvider"

import loginBackgroundImg from "./../asset/login-background.jpg" // TODO: only for test

import "./ItemCard.css"

function ItemCard() {
    const [accessToken, , displayName] = useAccessToken()

    return (
        <div className="card">
            <img src={loginBackgroundImg} alt="" className="card-img-top" />
            <div className="card-body">
                <h5 className="card-title">Test page entry</h5>
                <p className="card-text text-muted">www.example.com</p>
                <p className="card-tags">
                    <span className="badge bg-theme-orange">Tag 1</span>{" "}
                    <span className="badge bg-theme-pink">Tag 2</span>
                </p>
            </div>
        </div>
    )
}

export default ItemCard
