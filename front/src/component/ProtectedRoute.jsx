import { Navigate, Outlet } from 'react-router-dom'
import useAuth from '../hook/useAuth'
import { LogoLoader } from './logoLoader/LogoLoader'

export default function ProtectedRoute() {
    const { isAuthenticated, loading } = useAuth()
    if (loading) return <LogoLoader />
    return isAuthenticated ? <Outlet /> : <Navigate to="/" replace />
}
