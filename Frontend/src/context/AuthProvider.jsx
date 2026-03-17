import axios from "axios";
import React from "react";
import { jwtDecode } from "jwt-decode";
import { createContext, useEffect, useState } from "react";
import { axiosInterceptor } from "../utils/axios/axiosInterceptor";

const Auth = createContext()
export default Auth
export const AuthProvider = ({ children }) => {
    const [access, setAccess] = useState("")
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [loading, setLoading] = useState(true)
    const [user, setUser] = useState(null)
    const backendURL = "http://127.0.0.1:8000/api"
    // Control the login
    const login = async (email, password) => {
        const res = await axios.post(`${backendURL}/auth/login`, {
            email, password
        }, {
            withCredentials: true
        })
        if (res.status == 200) {
            setAccess(res.data.access)
            setUser(jwtDecode(res.data.access))
            setIsAuthenticated(true)
        }
    }
    const register = async (username, email, password1, password2) => {
        await axios.post(`${backendURL}/auth/register`, {
            username, email, password1, password2
        })
    }
    const logout = async () => {
        setUser(null)
        setIsAuthenticated(false)
        setAccess(false)
        // Remove the cookie from the browser
        await axios.post(`${backendURL}/auth/logout`, {}, {
            withCredentials: true,
            headers: {
                Authorization: `Bearer ${access}`
            }
        })
    }
    // For initial render
    useEffect(() => {
        const checkOrRefreshToken = async () => {
            if (access) {
                setLoading(false)
                return
            }
            if (!access) {
                // Get the token from the backend
                try {
                    const res = await axios.post(`${backendURL}/auth/token/refresh`, {}, { withCredentials: true })
                    setUser(jwtDecode(res.data.access))
                    setIsAuthenticated(true)
                    setAccess(res.data.access)
                    axiosInterceptor({ user: jwtDecode(res.data.access), logout, setAccess, setUser, access: res.data.access, setLoading })

                } catch (error) {
                    console.log(error)
                    logout()
                } finally {

                    setLoading(false)
                }
            }
        }
        checkOrRefreshToken()

    }, [])

    return (
        <Auth.Provider value={{
            register, login, logout, backendURL, user, setUser, access, setAccess, isAuthenticated, setIsAuthenticated
        }}>
            {loading ? (
                <div className="w-full h-full flex items-center justify-center">
                    <div className="size-12 border-t-transparent border-gray-400 rounded-full animate-spin"></div>
                </div>

            ) : children}
        </Auth.Provider>
    )
}