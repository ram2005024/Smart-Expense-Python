import dayjs from "dayjs";
import { axiosInstance } from "./axiosInstance";
import { jwtDecode } from "jwt-decode";

export const axiosInterceptor = ({ user, logout, setAccess, setUser, access, setLoading }) => {
    axiosInstance.interceptors.request.handlers = [];

    axiosInstance.interceptors.request.use(async (request) => {
        if (!user) {
            return request
        }
        // Get the expiration of the access token
        const exp = user.exp
        const isExpired = dayjs.unix(exp).diff(dayjs()) < 1
        if (!isExpired) {
            request.headers.Authorization = `Bearer ${access}`;

            return request
        }
        // If the token has expired try to refresh the token
        try {
            const response = await axiosInstance.post("/auth/token/refresh")
            // Setup the user and new access token
            setUser(jwtDecode(response.data.access))
            setAccess(response.data.access)
            request.headers.Authorization = `Bearer ${response.data.access}`
        } catch (error) {
            console.log(error)
            logout()
        }
        finally {
            setLoading(false)
        }
        return request
    })
}