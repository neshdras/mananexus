import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { apiService } from '../services/apiService'

let sessionRequest

const useStoreUser = create(persist((set) => ({
    user: null,
    loading: true,
    error: null,
    checkSession: () => {
        if (sessionRequest) return sessionRequest
        set({ loading: true, error: null })
        sessionRequest = apiService.auth.session()
            .then((user) => {
                set({ user, loading: false, error: null })
            })
            .catch(() => {
                set({ user: null, loading: false, error: 'Impossible de vérifier la session. Réessaie.' })
            })
            .finally(() => { sessionRequest = null })
        return sessionRequest
    },
    setUser: (user) => set({
        loading: false,
        error: null,
        user: {
            id_user: user.id_user,
            firstname_user: user.firstname_user,
            lastname_user: user.lastname_user,
            pseudo_user: user.pseudo_user,
            email_user: user.email_user,
            picture_user: user.picture_user,
        },
    }),
    clearUser: () => set({ user: null, loading: false, error: null }),
}), {
    name: 'shufflenexus-user',
    partialize: (state) => ({ user: state.user }),
}))

export default useStoreUser
