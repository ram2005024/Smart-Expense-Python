import useAuth from "../hooks/useAuth"
import { Navigate } from "react-router-dom"
import React from "react"
export const ProtectRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth()
    if (loading) {
        return <div>Loading...</div>
    }
    if (!loading && !isAuthenticated) {
        return <Navigate to="/login" replace />
    } else {
        return children
    }
}