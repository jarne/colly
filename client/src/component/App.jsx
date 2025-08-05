/**
 * Colly | main app file
 */

import { BrowserRouter, Routes, Route } from "react-router-dom"
import { ToastContainer } from "react-toastify"
import usePrefersColorScheme from "use-prefers-color-scheme"

import { UserAuthProvider } from "./context/UserAuthProvider"
import { AppDataProvider } from "./context/DataProvider"
import { CurrentInputProvider } from "./context/CurrentInputProvider"
import Login from "./../page/Login"
import Dashboard from "./../page/Dashboard"
import Admin from "./../page/Admin"

import "./../util/CustomBootstrap.scss"
import "bootstrap/dist/js/bootstrap.bundle"

import "bootstrap-icons/font/bootstrap-icons.css"
import "react-toastify/dist/ReactToastify.css"

function App() {
    const prefersColorScheme = usePrefersColorScheme()
    const isDarkMode = prefersColorScheme === "dark"

    return (
        <>
            <ToastContainer
                position="bottom-right"
                autoClose={3000}
                theme={isDarkMode ? "dark" : "light"}
            />
            <UserAuthProvider>
                <CurrentInputProvider>
                    <AppDataProvider>
                        <BrowserRouter>
                            <Routes>
                                <Route path="/login" element={<Login />} />
                                <Route path="/" element={<Dashboard />} />
                                <Route path="/admin" element={<Admin />} />
                                <Route
                                    path="/workspace/:wsId"
                                    element={<Dashboard />}
                                />
                                <Route
                                    path="/workspace/:wsId/tag/:tagId"
                                    element={<Dashboard />}
                                />
                            </Routes>
                        </BrowserRouter>
                    </AppDataProvider>
                </CurrentInputProvider>
            </UserAuthProvider>
        </>
    )
}

export default App
