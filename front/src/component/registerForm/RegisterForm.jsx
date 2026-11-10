import { useState } from 'react'
import useController  from '../../hook/useController'
import { apiService } from "../../services/apiService"
import './registerForm.scss'
import {useNavigate} from 'react-router-dom'
import useStoreUser from "../../hook/storeUser"
import { LogoLoader } from '../logoLoader/LogoLoader'

function FormRegister() {
  const query = apiService.auth.register
  const { loading, errorMessage, loadFetch} = useController()
  const [dataForm, setDataForm] = useState({firstname:"", lastname:"", email:"", password:""})
  const [info, setInfo] = useState(null)
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const [isAgree, setIsAgree] = useState(false)
  const regexPassword = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{8,}$/
  const regexMail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const setUser = useStoreUser((state) => state.setUser)
  const navigate = useNavigate()

  async function handleSubmit(e){
    e.preventDefault()
    setInfo("")
    if(dataForm.lastname.length <2) 
      return setInfo('Veuillez renseigner un nom valide')
    if(dataForm.firstname.length < 2 )
      return setInfo('Veuillez renseigner un prénom valide')
    
    if(dataForm.email.length <2)
      return setInfo('Veuillez renseigner un email valide')
    
    if(!regexPassword.test(dataForm.password)) 
      return setInfo(`Le mot de passe doit contenir minimum 8 caractères, une minuscule, une majuscule, une chiffre et un symbole.`)

    if(passwordConfirm !== dataForm.password)
      return setInfo('Les mots de passe ne sont pas identiques.')
    
    if(!regexMail.test(dataForm.email)) 
      return setInfo('Veuillez renseigner une adresse mail valide.')
    
    if(isAgree === false)
      return setInfo('Veuillez accepter les conditions')

    try {
      const res = await loadFetch(query, dataForm)
      if (!res?.user) return
      setUser(res.user)
      navigate('/profile', {replace: true})
    } catch {
      // useController exposes request errors in the form.
    }
  }
  
  return(
    <section className="register-form">

    {loading? <LogoLoader/> : ""}
    {errorMessage && <p className="register-form__message register-form__message--error" role='alert'>{errorMessage}</p>}
    <form className="register-form__form" onSubmit={handleSubmit}>
      <p className="register-form__message register-form__message--info">{info}</p>
      <label className="register-form__label" htmlFor="firstname">Prénom: </label>
      <input className="register-form__input" type="text" name="firstname" id="firstname" placeholder="Votre prénom" autoComplete='given-name' disabled={loading} onChange={(e) => setDataForm(prev => ({...prev, firstname: e.target.value}))}/>
      <label className="register-form__label" htmlFor="lastname">Nom de famille: </label>
      <input className="register-form__input" type="text" name="lastname" id="lastname" placeholder="Votre nom"  autoComplete='family-name' disabled={loading} onChange={(e) => setDataForm(prev => ({...prev, lastname: e.target.value}))}/>
      <label className="register-form__label" htmlFor="email">Email: </label>
      <input className="register-form__input" type="email" name="email" id="email" placeholder="prenom.nom@exemple.fr" autoComplete='email' disabled={loading} onChange={(e) => setDataForm(prev => ({...prev, email: e.target.value}))}/>
      <label className="register-form__label" htmlFor="pseudo">Pseudo: (optionnel)</label>
      <input className="register-form__input" type="text" name="pseudo" id="pseudo" placeholder="Votre pseudo" autoComplete='username' disabled={loading} onChange={(e) => setDataForm(prev => ({...prev, pseudo: e.target.value}))}/>
      <label className="register-form__label" htmlFor="pass">Password</label>
      <input className="register-form__input" type="password" name="pass" id="pass" placeholder="Au moins 6 caractères, une majuscule, un chiffre et un symbole" autoComplete='new-password' disabled={loading} onChange={(e) => setDataForm(prev => ({...prev, password: e.target.value}))}/>
      <label className="register-form__label" htmlFor="pass-confirm">Confirmation Password</label>
      <input className="register-form__input" type="password" name="pass-confirm" id="pass-confirm" disabled={loading} onChange={(e) => {
        setPasswordConfirm(e.target.value)
        setInfo(e.target.value !== dataForm.password ? 'Les mots de passe ne sont pas identiques.' : null)
      }}/>
      <label className="register-form__consent" htmlFor="rgpd"><input className="register-form__consent-input" type="checkbox" name="rgpd" id="rgpd" onChange={()=>setIsAgree(!isAgree)} /> En cochant cette case, je suis d'accord de partager les informations donnée ci-dessus avec Nexus Shuffle</label>
      <button className="register-form__submit" type="submit" disabled={loading}>{loading ? "Loading..." : "Inscription"}</button>
    </form>
    </section>
  )
}

export default FormRegister
