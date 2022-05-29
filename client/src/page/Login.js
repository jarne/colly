/**
 * Colly | login page
 */

import loginBackgroundImg from "./../asset/login-background.jpg"
import collyLogoImg from "./../asset/colly-logo.png"

import "./Login.css"

function Login() {
    return (
        <>
            <img
                src={loginBackgroundImg}
                alt=""
                className="login-background-img"
                loading="lazy"
            />
            <div className="login-overlay">
                <div className="login-content">
                    <img
                        src={collyLogoImg}
                        alt="Colly logo"
                        className="login-logo"
                        loading="lazy"
                    />
                    <h1>Colly</h1>
                    <form className="mt-4">
                        <div className="mb-3">
                            <label for="loginUsername" className="form-label">
                                Username
                            </label>
                            <input
                                type="text"
                                className="form-control custom-form-control-lg"
                                id="loginUsername"
                                placeholder="Username"
                            />
                        </div>
                        <div className="mb-3">
                            <label for="loginPassword" className="form-label">
                                Password
                            </label>
                            <input
                                type="password"
                                className="form-control custom-form-control-lg"
                                id="loginPassword"
                                placeholder="Password"
                            />
                        </div>
                        <button
                            type="submit"
                            className="btn btn-outline-theme-pink btn-lg mt-2"
                        >
                            Login
                        </button>
                    </form>
                </div>
            </div>
        </>
    )
}

export default Login
