

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

export const getAllSkillsAPI = async (token, userId) => {
    try {
        // console.log(token, userId)
        const response = await fetch(`${API_URL}/skills/users/${userId}`, {
            method: 'GET',
            headers: { Authorization: token }
        })
        // console.log("getall",response)
        if (!response.ok) throw new Error("Failed to fetch skills")
        return await response.json()
    } catch (err) {
        console.log("Error while fetching skills", err)
        return null
    }
}

export const createSkillAPI = async (name, goal, token) => {
    try {
        const response = await fetch(`${API_URL}/skills/`, {
            method: 'POST',
            body: JSON.stringify({ name, goal }),
            headers: {
                'Content-Type': 'application/json',
                Authorization: token
            }
        })
        if (!response.ok) throw new Error("Failed to create skill")
        return await response.json()
    } catch (err) {
        console.log("Error during skill creation", err)
        return null
    }
}

export const updateSkillAPI = async (skillId, token, name, goal, sessionDuration = 0 ) => {
    try {
        const response = await fetch(`${API_URL}/skills/${skillId}`, {
            method: 'PATCH',
            body: JSON.stringify({ name, goal, sessionDuration }),
            headers: {
                'Content-Type': 'application/json',
                Authorization: token
            }
        })
        if (!response.ok) throw new Error("Failed to updated skill")
        return await response.json()
    } catch (err) {
        console.log("Error during skill update", err)
        return null
    }
}

export const deleteSkillAPI = async (skillId, token) => {
    try {
        const response = await fetch(`${API_URL}/skills/${skillId}`, {
            method: 'DELETE',
            headers: { Authorization: token }
        })
        if (!response.ok) throw new Error("Failed to delete skill")
        return await response.json()
    } catch (err) {
        console.log("Error during skill deletion", err)
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