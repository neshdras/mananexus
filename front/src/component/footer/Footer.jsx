import { Link } from "react-router-dom";
import './Footer.scss'

export function Footer(){

    return(
        <footer className="site-footer">
            <p className="site-footer__copyright">FORET Antonin &#169; {new Date().getFullYear()}</p>
            <Link className="site-footer__link" to={"/legal-mention"}>Mentions Légales</Link>
        </footer>
    )
}
