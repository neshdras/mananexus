import useStoreUser from './storeUser'

export default function useAuth() {
    const user = useStoreUser((state) => state.user)
    const loading = useStoreUser((state) => state.loading)
    const error = useStoreUser((state) => state.error)
    const setUser = useStoreUser((state) => state.setUser)
    const clearUser = useStoreUser((state) => state.clearUser)
    const checkSession = useStoreUser((state) => state.checkSession)

    return { user, loading, error, setUser, clearUser, checkSession,
        isAuthenticated: Boolean(user) }
}
