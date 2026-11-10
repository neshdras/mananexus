import useController from "../../hook/useController"
import { useState } from "react"
import { apiService } from "../../services/apiService"
import {useNavigate} from 'react-router-dom'
import useAuth from "../../hook/useAuth"
import {LogoLoader} from "../logoLoader/LogoLoader"
import './loginForm.scss'
function Login() {
  const { setUser } = useAuth()
  const navigate = useNavigate()
    const regexPassword = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{8,}$/
    const query = apiService.auth.login
    const {loading, errorMessage, loadFetch} = useController()
    const [info, setInfo] = useState({identifiant:'', password:''})
    const [message, setMessage] = useState(null)
    async function handleSubmit(e) {
        e.preventDefault()
        if(info.identifiant.length < 3)
          return setMessage("Veuillez renseigner tous les champs demandés")
        if(!regexPassword.test(info.password))
          return setMessage("Le mot de passe doit contenir minimum 8 caractères, une minuscule, une majuscule, une chiffre et un symbole.")

          try {
            const res = await loadFetch(query, info)
            if (!res?.user) return
            setUser(res.user)
            navigate('/profile', {replace: true})
          } catch {
            // useController exposes request errors in the form.
          }
        
    }
    //Erreur lors du chargement, veuillez réessayer plus tard
  return (
    <div className="login-form">
    <form className="login-form__form" onSubmit={handleSubmit}>
          {loading? <LogoLoader/> : ""}
    <p className="login-form__message login-form__message--error" role="alert">{errorMessage ? errorMessage : ""}</p>
        <p className="login-form__message login-form__message--info">{message}</p>
        <label className="login-form__label" htmlFor="identifiant">Identifiant: </label>
        <input className="login-form__input" type="text" name="identifiant" id="identifiant" placeholder="you@example.com" autoComplete="username" onChange={(e) => setInfo(prev => ({...prev, identifiant: e.target.value}))}/>
        <label className="login-form__label" htmlFor="pass">Password </label>
        <input className="login-form__input" type="password" name="pass" id="pass" placeholder="••••••••" autoComplete="current-password" onChange={(e) => setInfo(prev => ({...prev, password: e.target.value}))}/>
        <button className="login-form__submit" type="submit" disabled={loading}>{loading ? "Loading..." : "Connexion"}</button>
    </form>

    </div>
  )
}

export default Login
