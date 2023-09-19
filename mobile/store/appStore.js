import { create } from "zustand";
import { createJSONStorage, persist } from 'zustand/middleware';
import { zustandStorage } from './mmkv';
import jwtDecode from 'jwt-decode'

// Split the store
const useAppStore = create()(persist((set, get) => ({
    USER_ID: null,
    TOKEN: null, // Do not alter directly
    setToken: (newToken) => {
        const decodedToken = jwtDecode(newToken)
        set({ TOKEN: newToken, USER_ID: decodedToken.userId })
    },
    getToken: () => {
        const token = get().TOKEN
        if (token) {
            const decodedToken = jwtDecode(token)
            const tokenHasExpired = decodedToken.exp < Date.now() / 1000
            if (tokenHasExpired) {
                set({ TOKEN: null })
                return null
            } else {
                return token
            }
        }
        return null
    },
    removeToken: () => set({ TOKEN: null }),
    timeStarted: null,
    durationInSecs: null,
    setTimeStarted: (newTime, durationInSecs) => {
        set({ timeStarted: newTime, durationInSecs: durationInSecs })
    },
    getSecsLeft: () => {
        const timeStarted = get().timeStarted
        const durationInSecs = get().durationInSecs
        if (timeStarted !== null && durationInSecs !== null) {
            const timeLeft = parseInt(timeStarted / 1000) + durationInSecs - parseInt(Date.now() / 1000)
            return timeLeft
        }
        return 0
    },
    darkMode: false,
    toggleDarkMode: () => set(state => ({ darkMode: !state.darkMode })),
}), {
    name: 'app-storage',
    storage: createJSONStorage(() => zustandStorage)
})
)

export default useAppStore