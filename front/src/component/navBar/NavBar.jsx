import {Link} from "react-router-dom"
import './navBar.scss'
export function NavBar(){
    return(
        <header>
            <Link to="/"><img src="/logo.svg" alt="logo Nexus Shuffle" /></Link>
            <nav>
                <ul>
                    <li><Link to='/'>Acceuil</Link></li>
                    <li><Link to='/tournament'>Tournoi</Link></li>
                    <li><Link to='/profile'>Profil</Link></li>
                </ul>
                
                
            </nav>
        </header>
    )
}
