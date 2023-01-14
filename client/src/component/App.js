/**
 * Colly | main app file
 */

import { BrowserRouter, Routes, Route } from "react-router-dom"
import { ToastContainer } from "react-toastify"

import { UserAuthProvider } from "./context/UserAuthProvider"
import Login from "./../page/Login"
import Dashboard from "./../page/Dashboard"

import "./../util/CustomBootstrap.scss"
import "./../../node_modules/bootstrap/dist/js/bootstrap.bundle"

import "./../../node_modules/bootstrap-icons/font/bootstrap-icons.css"
import "./../../node_modules/react-toastify/dist/ReactToastify.min.css"

function App() {
    return (
        <>
            <ToastContainer />
            <UserAuthProvider>
                <BrowserRouter>
                    <Routes>
                        <Route path="/login" element={<Login />} />
                        <Route path="/dashboard" element={<Dashboard />} />
                    </Routes>
                </BrowserRouter>
            </UserAuthProvider>
        </>
    )
}

export default App
