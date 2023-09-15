import { zustandStorage } from "../store/mmkv"
import { TOKEN } from "../constants/constants"

const API_URL = "http://192.168.0.111:5000/api"

export const signupUser = async ({ name, email, password }) => {
    try {
        const response = await fetch(`${API_URL}/users/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password })
        })
        if (!response.ok) throw new Error("Failed to signup")
        return await response.json()
    } catch (err) {
        console.log("Error signing up ", err)
        return null
    }
}

export const loginUser = async ({ email, password }) => {
    try {
        const response = await fetch(`${API_URL}/users/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        })
        if (!response.ok) throw new Error("Failed to login")
        return await response.json()
    } catch (err) {
        console.log("Error during login", err)
        return null
    }
}
export const fetchLeaderboards = async () => {
    try {
        const response = await fetch(
            `${API_URL}/users/leaderboards/global`,
            { headers: { Authorization: "Bearer " + zustandStorage.getItem(TOKEN) } }
        )
        if (!response.ok) throw new Error("failed to fetch leaderboards")
        return await response.json()
    } catch (err) {
        console.log("Error in fetching leaderboards", err)
        return null
    }
}