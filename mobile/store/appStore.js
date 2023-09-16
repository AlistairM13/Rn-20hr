import { create } from "zustand";
import { createJSONStorage, persist } from 'zustand/middleware';
import { zustandStorage } from './mmkv';
import jwtDecode from 'jwt-decode'

const useAppStore = create()(persist((set, get) => ({
    TOKEN: null, // Do not alter directly
    setToken: (newToken) => set({ TOKEN: newToken }),
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
    darkMode: false,
    toggleDarkMode: () => set(state => ({ darkMode: !state.darkMode })),
}), {
    name: 'app-storage',
    storage: createJSONStorage(() => zustandStorage)
})
)

export default useAppStore