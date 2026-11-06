import { Link } from "react-router-dom";
import './Footer.scss'

export function Footer(){

    return(
        <footer>
            <p>FORET Antonin &#169; {new Date().getFullYear()}</p>
            <Link to={"/legal-mention"}>Mentions Légales</Link>
        </footer>
    )
}