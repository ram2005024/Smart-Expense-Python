import { useContext } from "react";

import Auth from "../context/AuthProvider";
const useAuth = () => {
    return useContext(Auth)
}
export default useAuth