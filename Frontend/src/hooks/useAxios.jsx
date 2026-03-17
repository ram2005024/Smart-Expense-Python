import axios from "axios";
import useAuth from "./useAuth";
import dayjs from "dayjs";
import { jwtDecode } from "jwt-decode";
export const useAxios = () => {
    const { user, setUser, setAccess, backendURL, logout, setIsAuthenticated, access } = useAuth()
    const instance = axios.create({
        baseURL: backendURL,
        withCredentials: true
    })

    // Create the interceptors
    // Request interceptor
    instance.interceptors.request.use(async request => {
        // Check whether the access token has expired or not
        const isExpired = dayjs.unix(user.exp).diff(dayjs()) < 1
        if (!isExpired) {
            request.headers.Authorization = `Bearer ${access}`;
            return request;

        }
        // If it is expired get the new refresh token
        try {
            const res = await axios.post(`${backendURL}/auth/token/refresh`)
            setUser(jwtDecode(res.data.access))
            setAccess(res.data.access)
            setIsAuthenticated(true)
            request.headers.Authorization = `Bearer ${res.data.access}`

        } catch (error) {
            console.log(error)
            logout()
            return request
        }
        (error) => Promise.reject(error)
    })
    return instance
}