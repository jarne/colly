/**
 * Colly | login page
 */

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"

import { login } from "./../logic/api/auth"
import { useUserAuth } from "./../component/context/UserAuthProvider"

import loginBackgroundImg from "./../asset/login-background.jpg"
import collyLogoImg from "./../asset/colly-logo.png"

import "./Login.css"

function Login() {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")

    const navigate = useNavigate()
    const [, setAccessToken, , setDisplayName, , setIsAdmin] = useUserAuth()

    const handleSubmit = async (e) => {
        e.preventDefault()

        let data
        try {
            data = await login(username, password)
        } catch (e) {
            toast.error(e.message)

            return
        }

        setAccessToken(data.token)
        setDisplayName(data.user.username)
        setIsAdmin(data.user.isAdmin)

        navigate("/")
    }

    return (
        <div className="d-flex flex-row">
            <div className="login-overlay">
                <div className="login-content">
                    <img
                        src={collyLogoImg}
                        alt="Colly logo"
                        className="login-logo"
                        loading="lazy"
                    />
                    <h1>Colly</h1>
                    <form onSubmit={handleSubmit} className="mt-4">
                        <div className="mb-3">
                            <label
                                htmlFor="loginUsername"
                                className="form-label"
                            >
                                Username
                            </label>
                            <input
                                type="text"
                                className="form-control custom-form-control-lg"
                                id="loginUsername"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="Username"
                                autoFocus
                            />
                        </div>
                        <div className="mb-3">
                            <label
                                htmlFor="loginPassword"
                                className="form-label"
                            >
                                Password
                            </label>
                            <input
                                type="password"
                                className="form-control custom-form-control-lg"
                                id="loginPassword"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Password"
                            />
                        </div>
                        <button
                            type="submit"
                            className="btn btn-outline-secondary btn-lg mt-2"
                        >
                            Login
                        </button>
                    </form>
                </div>
            </div>
            <div className="login-bg-wrapper flex-grow-1 bg-info">
                <img
                    src={loginBackgroundImg}
                    alt=""
                    className="login-background-img"
                    loading="lazy"
                />
            </div>
        </div>
    )
}

export default Login
