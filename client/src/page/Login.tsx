/**
 * Colly | login page
 */

import { useState, type ChangeEvent, type SubmitEvent } from "react"
import { useNavigate } from "react-router"
import { toast } from "react-toastify"
import { useUserAuth } from "./../component/context/UserAuthProvider"
import { login, type LoginRes } from "./../logic/api/auth"

import collyLogoImg from "./../asset/colly-logo.png"
import loginBackgroundImg from "./../asset/login-background.jpg"

import "./Login.css"

function Login() {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")

    const navigate = useNavigate()
    const { setAccessToken, setUserId, setDisplayName, setIsAdmin } =
        useUserAuth()

    const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
        e.preventDefault()

        let data: LoginRes
        try {
            data = await login(username, password)
        } catch (e) {
            if (e instanceof Error) toast.error(e.message)

            return
        }

        setAccessToken(data.token)
        setUserId(data.user.id)
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
                                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                    setUsername(e.target.value)
                                }
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
                                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                    setPassword(e.target.value)
                                }
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
