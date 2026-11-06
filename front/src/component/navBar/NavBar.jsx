import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import useAuth from "../../hook/useAuth"
import { apiService } from "../../services/apiService"
import './navBar.scss'
export function NavBar(){
    const { user, clearUser } = useAuth()
    const navigate = useNavigate()
    const [isLoggingOut, setIsLoggingOut] = useState(false)
    const [logoutError, setLogoutError] = useState('')

    const handleLogout = async () => {
        setIsLoggingOut(true)
        setLogoutError('')

        try {
            await apiService.auth.logout()
            clearUser()
            navigate('/', { replace: true })
        } catch {
            setLogoutError('La déconnexion a échoué. Réessaie.')
        } finally {
            setIsLoggingOut(false)
        }
    }

    return(
        <header className="nav-bar">
            <Link className="nav-bar__brand" to="/"><img src="/logo.svg" alt="logo Nexus Shuffle" /></Link>
            <nav className="nav-bar__nav">
                <ul className="nav-bar__links">
                    <li><Link to='/'>Acceuil</Link></li>
                    <li><Link to='/tournament'>Tournoi</Link></li>
                    <li><Link to='/profile'>Profil</Link></li>
                    {user && (
                        <li>
                            <button
                                className="logout-button"
                                type="button"
                                onClick={handleLogout}
                                disabled={isLoggingOut}
                            >
                                {isLoggingOut ? 'Déconnexion…' : 'Déconnexion'}
                            </button>
                        </li>
                    )}
                </ul>
            </nav>
            {logoutError && <p className="logout-error" role="alert">{logoutError}</p>}
        </header>
    )
}
