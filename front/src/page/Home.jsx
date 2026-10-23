import { Form } from "./Form"
import '../styles/page/Home.scss'
export function Home(){
    return(
        <main id="home">
            <section>
                <h1>Bienvenue sur <span>Nexus Shuffle</span></h1>
                <p>Votre nouveau gestionnaire de tournois TCG</p>
                <p>Que vous soyez joueur de Magic: The Gathering, de Pokémon, de Riftbound, de Yu-Gi-Oh ou même d'Altered !</p>
                <p>Trouvez les tournois près de chez vous !</p>
            </section>
            <section>
                <h2>Que vous soyez :</h2>
                <div>
                    <article>
                        <h3>Joueur :</h3>
                        
                        <ul>
                            <li>Retrouvez tous les tournois qui vous intéressent</li>
                            <li>Vous voulez une decklist d'un joueur spécifique ? Vous l'aurez !</li>
                        </ul>
                    </article>
                    <article>
                        <h3>Gérant d'une boutique :</h3>
                        <ul>
                            <li>Créez vos tournois et voyez en temps réel qui s'y intéresse</li>
                            <li>Plus besoin de courir après les decklists : les joueurs devront s'inscrire avec leur decklist !</li>
                        </ul>
                    </article>
                </div>
                <aside><Form/></aside>
            </section>
        </main>
    )
}
