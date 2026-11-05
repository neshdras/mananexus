import { LogoLoader } from "../component/logoLoader/LogoLoader";
import { Link } from 'react-router-dom';
import useAuth from '../hook/useAuth';
import '../styles/page/NotFound.scss';

export function NotFound(){
    const { isAuthenticated } = useAuth();
    return(
        <main className="not-found" aria-labelledby="not-found-title">
            <Link className="not-found__brand" to="/">Nexus Shuffle <span>✦</span></Link>
            <div className="not-found__layout">
                <div className="not-found__deck" aria-hidden="true">
                    <div className="not-found__card">
                        <div className="not-found__card-header"><span>PORTAIL ÉGARÉ</span><span>✦</span></div>
                        <div className="not-found__art"><LogoLoader decorative /><span>404</span></div>
                        <div className="not-found__card-body">
                            <p>Carte introuvable</p>
                            <span>Sortilège · Hors du deck</span>
                            <hr />
                            <em>« Même les meilleurs explorateurs prennent parfois le mauvais portail. »</em>
                        </div>
                        <div className="not-found__card-footer"><span>NEXUS SHUFFLE</span><span>404 / ∞</span></div>
                    </div>
                </div>
                <section className="not-found__message">
                    <p className="not-found__eyebrow">ERREUR 404 · PAGE INTROUVABLE</p>
                    <h1 id="not-found-title">Cette carte ne fait pas partie de ton deck.</h1>
                    <p>Cette page n’existe pas ou a été déplacée. Reviens à l’accueil pour reprendre la partie.</p>
                    <div className="not-found__actions">
                        <Link className="not-found__primary" to="/">Retour à l’accueil <span aria-hidden="true">↗</span></Link>
                        {isAuthenticated && <Link className="not-found__secondary" to="/tournament">Voir les tournois <span aria-hidden="true">→</span></Link>}
                    </div>
                    <p className="not-found__hint">Une mauvaise pioche, ça arrive.</p>
                </section>
            </div>
        </main>
    )
}
