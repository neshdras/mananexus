import {Link} from "react-router-dom"
export function NavBar(){
    return(
        <header>
            <Link to="/"><img src="/front/public/logo.svg" alt="logo Nexus Shuffle" /></Link>
            <nav>
                <Link to='/'>Acceuil</Link>
                <Link to='/tournament'>Tournoi</Link>
                <Link to='/profil'>Profile</Link>
            </nav>
        </header>
    )
}