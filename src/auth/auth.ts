import {jwtDecode} from "jwt-decode";
import type { UserData } from "../model/UserData";

export const isTokenExpired = (token: string) => {
    try {
        // Get expiration date time
        const { exp } = jwtDecode(token);
        if (!exp) return true // Treat when exp date is undefined as expired
        return Date.now() >= exp * 1000;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
        return true; // Treat invalid tokens as expired
    }
};
export function getUserFromToken(token: string): UserData {
    return jwtDecode<UserData>(token);
}