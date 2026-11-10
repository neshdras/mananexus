import { Footer } from "../component/footer/Footer";
import { useEffect } from "react";
import { NavBar } from "../component/navBar/NavBar";
import '../styles/page/LegalMention.scss'

export function LegalNotice() {
    useEffect(()=>{
        document.title = "Nexus Shuffle | Mentions Légales"
    })
    return(
        <>
        <NavBar/>
            <main className="legal-notice">
                <h1 className="legal-notice__title">Mentions Légales</h1>
                <section className="legal-notice__content">
                    <article className="legal-notice__article">
                        <h2 className="legal-notice__heading">Propriétaire du site</h2>
                        <ul className="legal-notice__list">
                            <li><span className="legal-notice__label">Nom : </span>FORET Antonin</li>
                            <li><span className="legal-notice__label">Adresse électronique : </span>antoninforet67@gmail.com</li>
                            <li><span className="legal-notice__label">Téléphone : </span>0606060606</li>
                            <li><span className="legal-notice__label">Adresse postale : </span>394 route d'Ambiole 40180 Goos</li>
                        </ul>
                    </article>
                    <article className="legal-notice__article">
                        <h2 className="legal-notice__heading">Hébergement du site</h2>
                        <ul className="legal-notice__list">
                            <li><span className="legal-notice__label">Hébergeur : </span>Vercel France</li>
                            <li><span className="legal-notice__label">Capital : </span>1 936,67 €</li>
                            <li><span className="legal-notice__label">Siège social : </span>Paris</li>
                            <li><span className="legal-notice__label">RCS : </span>828 193 722 R.C.S. Paris</li>
                        </ul>
                    </article>
                    <article className="legal-notice__article">
                        <h2 className="legal-notice__heading">Collecte des données personnelles</h2>
                        <ul className="legal-notice__list">
                            <li><span className="legal-notice__label">Responsable du traitement des données : </span>FORET Antonin</li>
                            <li><span className="legal-notice__label">Téléphone : </span>0606060606</li>
                            <li><span className="legal-notice__label">Finalité du traitement : </span>Le site récolte votre nom, prénom, psudonyme et adresse mail afin de garder votre accès au service du site</li>
                            <li><span className="legal-notice__label">Durée de conservation : </span>Ces données sont conservées jusqu'à la suppresion de votre compte ou au bout d'un an d'inactivité, afin d’avoir une maintenance de votre accès au service du site.</li>
                            <li><span className="legal-notice__label">Droit de réclamation : </span>En cas de désaccord avec ses information, vous avez le droit d'introduire une réclamation auprès d'une autorité de contrôle</li>
                        </ul>
                        <p className="legal-notice__paragraph">Conformement aux lois RGPD, en cochant cette case,  j'accepte que mes données soient conservées dans le but d'avoir accés au site et à ses service</p>
                    </article>
                    <article className="legal-notice__article">
                        <h2 className="legal-notice__heading">Condition générale d'utilisation</h2>
                        <p className="legal-notice__paragraph">Les présentes CGU ou Conditions Générales d’Utilisation encadrent juridiquement l’utilisation des services du site. Constituant le contrat entre le créateur du site, l’Utilisateur, l’accès au site doit être précédé de l’acceptation de ces CGU. L’accès à cette plateforme signifie l’acceptation des présentes CGU.</p>
                        <ul className="legal-notice__list">
                            <li><span className="legal-notice__label">Accès au site : </span> L'accès au site est gratuit mais nécéssite une inscription pour accéder à ses services.</li>
                            <li><span className="legal-notice__label">responsabilité : </span>Bien que les informations publiées sur le site soient réputées fiables, le site se réserve la faculté d’une non-garantie de la fiabilité des sources. En dépit des mises à jour régulières, la responsabilité du site ne peut être engagée en cas de modification des dispositions administratives et juridiques apparaissant après la publication. Il en est de même pour l’utilisation et l’interprétation des informations communiquées sur la plateforme. Le site décline toute responsabilité concernant les éventuels virus pouvant infecter le matériel informatique de l’Utilisateur après l’utilisation ou l’accès à ce site. Le site ne peut être tenu pour responsable en cas de force majeure ou du fait imprévisible et insurmontable d’un tiers. La garantie totale de la sécurité et la confidentialité des données n’est pas assurée par le site. Cependant, le site s’engage à mettre en œuvre toutes les méthodes requises pour le faire au mieux.</li>
                            <li><span className="legal-notice__label">Modification : </span>La modification des CGU peut être éffectué à chaque mise à jour. Une demande de consentent sera communiqué à chaque changement.</li>
                        </ul>
                    </article>
                </section>
            </main>
            <Footer/>
        </>
    )
}
