/**
 * Colly | main app file
 */

import { BrowserRouter, Routes, Route } from "react-router-dom"
import { ToastContainer } from "react-toastify"

import { UserAuthProvider } from "./context/UserAuthProvider"
import { AppDataProvider } from "./context/DataProvider"
import Login from "./../page/Login"
import Dashboard from "./../page/Dashboard"
import Admin from "./../page/Admin"

import "./../util/CustomBootstrap.scss"
import "./../../node_modules/bootstrap/dist/js/bootstrap.bundle"

import "./../../node_modules/bootstrap-icons/font/bootstrap-icons.css"
import "./../../node_modules/react-toastify/dist/ReactToastify.css"

function App() {
    return (
        <>
            <ToastContainer />
            <UserAuthProvider>
                <AppDataProvider>
                    <BrowserRouter>
                        <Routes>
                            <Route path="/login" element={<Login />} />
                            <Route path="/" element={<Dashboard />} />
                            <Route path="/admin" element={<Admin />} />
                            <Route path="/tag/:tagId" element={<Dashboard />} />
                        </Routes>
                    </BrowserRouter>
                </AppDataProvider>
            </UserAuthProvider>
        </>
    )
}

export default App
