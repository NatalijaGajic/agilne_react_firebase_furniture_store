import jwt_decode from "jwt-decode";

export const getToken = () => {
    return sessionStorage.getItem("token") || null;
}

export const getRole = () => {
    const token = sessionStorage.getItem("token") || null;
    if(!token) {
        return null;
    }
    const decodedJWT = jwt_decode(token)
    return decodedJWT.Role;
}

export const getUsername = () => {
    const token = sessionStorage.getItem("token") || null;
    if(!token) {
        return null;
    }
    const decodedJWT = jwt_decode(token)
    return decodedJWT.User;
    
}

export const setUserSession = (token) => {
    sessionStorage.setItem("token", token);
}

export const removeUserSession = () => {
    sessionStorage.removeItem("token");
}