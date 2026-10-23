import { useState } from 'react'
import useController  from '../../hook/useController'
import { apiService } from "../../services/apiService"
import './registerForm.scss'


function FormRegister() {
  const query = apiService.auth.register
  const { loading, errorMessage, loadFetch} = useController()
  const [dataForm, setDataForm] = useState({firstname:"", lastname:"", email:"", password:""})
  const [info, setInfo] = useState(null)
  const [isAgree, setIsAgree] = useState(false)
  const regexPassword = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{8,}$/
  const regexMail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


  async function handleSubmit(e){
    e.preventDefault()
    if(dataForm.lastname.length <2 || dataForm.firstname.length < 2 || dataForm.email.length <2) 
      return setInfo('Veuillez renseigner tous les champs demandés.')
    
    
    if(!regexPassword.test(dataForm.password)) 
      return setInfo(`Le mot de passe doit contenir minimum 8 caractères, une minuscule, une majuscule, une chiffre et un symbole.`)
    
    if(!regexMail.test(dataForm.email)) 
      return setInfo('Veuillez renseigner une adresse mail valide.')
    
    const res = await loadFetch(query, dataForm)
    
    if(res?.token){
      setInfo(res)
    }
  }
  
  return(
    <section id="registerForm">

    <p className='load'>{loading? "Loading..." : ""}</p>
    <p className='err'>{errorMessage? "Erreur lors du chargement, veuillez réessayer plus tard" : ""}</p>
    <p>{loading === true ? "Loading..." : ""}</p>
    <form onSubmit={handleSubmit}>
      <p className="info">{info}</p>
      <label htmlFor="firstname">Prénom: </label>
      <input type="text" name="firstname" id="firstname" placeholder="Votre prénom" autoComplete='firstname' disabled={loading} onChange={(e) => setDataForm(prev => ({...prev, firstname: e.target.value}))}/>
      <label htmlFor="lastname">Nom de famille: </label>
      <input type="text" name="lastname" id="lastname" placeholder="Votre nom"  autoComplete='lastname' disabled={loading} onChange={(e) => setDataForm(prev => ({...prev, lastname: e.target.value}))}/>
      <label htmlFor="email">Email: </label>
      <input type="email" name="email" id="email" placeholder="prenom.nom@exemple.fr" autoComplete='email' disabled={loading} onChange={(e) => setDataForm(prev => ({...prev, email: e.target.value}))}/>
      <label htmlFor="pseudo">Pseudo: (optionnel)</label>
      <input type="text" name="pseudo" id="pseudo" placeholder="Votre pseudo" autoComplete='username' disabled={loading} onChange={(e) => setDataForm(prev => ({...prev, pseudo: e.target.value}))}/>
      <label htmlFor="pass">Password</label>
      <input type="password" name="pass" id="pass" placeholder="Au moins 6 caractères, une majuscule, un chiffre et un symbole" autoComplete='password' disabled={loading} onChange={(e) => setDataForm(prev => ({...prev, password: e.target.value}))}/>
      <label htmlFor="rgpd"><input type="checkbox" name="rgpd" id="rgpd" onChange={()=>setIsAgree(!isAgree)} /> En cochant cette case, je suis d'accord de partager les informations donnée ci-dessus avec Nexus Shuffle</label>
      <button type="submit" disabled={loading}>{loading ? "Loading..." : "Inscription"}</button>
    </form>
    </section>
  )
}

export default FormRegister
