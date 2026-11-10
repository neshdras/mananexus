import { Form} from './Form'
import '../styles/page/Home.scss'
import { Footer } from "../component/footer/Footer"
import { NavBar } from '../component/navBar/NavBar'
import useAuth from '../hook/useAuth'
import { Navigate } from 'react-router-dom'

export function Home(){
    const { user } = useAuth()
    
    if(user) return <Navigate to='/profile' replace/>
    return(
        <>
        <NavBar/>
        <main className="home">
            <section className="home__intro">
                <h1 className="home__title">Bienvenue sur <span className="home__title-accent">Nexus Shuffle</span></h1>
                <p className="home__lead">Votre nouveau gestionnaire de tournois TCG</p>
                <p className="home__description">Que vous soyez joueur de Magic: The Gathering, de Pokémon, de Riftbound, de Yu-Gi-Oh ou même d'Altered !</p>
                <p className="home__highlight">Trouvez les tournois près de chez vous !</p>
            </section>
            <section className="home__audience">
                <h2 className="home__audience-title">Que vous soyez :</h2>
                <div className="home__audience-cards">
                    <article className="home__audience-card">
                        <h3 className="home__card-title">Joueur :</h3>
                        <ul className="home__benefits">
                            <li className="home__benefit">Retrouvez tous les tournois qui vous intéressent</li>
                            <li className="home__benefit">Vous voulez une decklist d'un joueur spécifique ? Vous l'aurez !</li>
                        </ul>
                    </article>
                    <article className="home__audience-card">
                        <h3 className="home__card-title">Gérant d'une boutique :</h3>
                        <ul className="home__benefits">
                            <li className="home__benefit">Créez vos tournois et voyez en temps réel qui s'y intéresse</li>
                            <li className="home__benefit">Plus besoin de courir après les decklists : les joueurs devront s'inscrire avec leur decklist !</li>
                        </ul>
                    </article>
                </div>
                <aside className="home__signup"><Form/></aside>
            </section>
        </main>
        <Footer/>
        </>
    )
}
