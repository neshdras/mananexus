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
    const [isMenuOpen, setIsMenuOpen] = useState(false)

    const handleLogout = async () => {
        setIsLoggingOut(true)
        setLogoutError('')
        setIsMenuOpen(false)

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

    if (user) 
        return(
        <header className="nav-bar">
            <img className="nav-bar__logo" src="/logo.svg" alt="logo Nexus Shuffle" />
           
            <button
                className="nav-bar__toggle"
                type="button"
                aria-label={isMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
                aria-expanded={isMenuOpen}
                aria-controls="nav-bar-menu"
                onClick={() => setIsMenuOpen((isOpen) => !isOpen)}
            >
                <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                    <path d="M3 6h18M3 12h18M3 18h18" />
                </svg>
            </button>
            <nav className={`nav-bar__nav${isMenuOpen ? ' nav-bar__nav--open' : ''}`} id="nav-bar-menu">
                <ul className="nav-bar__links">
                    <li><Link className="nav-bar__link" to='/tournament' onClick={() => setIsMenuOpen(false)}>Tournoi</Link></li>
                    <li><Link className="nav-bar__link" to='/profile' onClick={() => setIsMenuOpen(false)}>Profil</Link></li>
                    <li>
                        <button className="nav-bar__logout" type="button" onClick={handleLogout} disabled={isLoggingOut}>
                            {isLoggingOut ? 'Déconnexion…' : 'Déconnexion'}
                        </button>
                    </li>
                    
                </ul>
            </nav>
            {logoutError && <p className="nav-bar__logout-error" role="alert">{logoutError}</p>}
        
        </header>
    )
    return(
        <header className="nav-bar">
            <Link className="nav-bar__brand" to="/"><img className="nav-bar__logo" src="/logo.svg" alt="logo Nexus Shuffle" /></Link>
        </header>
    )
}
