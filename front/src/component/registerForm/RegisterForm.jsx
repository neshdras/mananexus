import { useState } from 'react'
import useController from '../../hook/useCOntroller'
import { apiService } from "../../services/apiService"

function FormRegister() {
  const query = apiService.auth.register
  const {data, loading, errorMessage, loadFetch} = useController()
  const [dataForm, setDataForm] = useState({firstname:"", lastname:"", email:"", password:""})
  const [info, setInfo] = useState(null)
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
    
    await loadFetch(query, dataForm)
  }
  
  return(
    <>
    <p className='load'>{loading? "Loading..." : ""}</p>
    <p className='err'>{errorMessage? "Erreur lors du chargement, veuillez réessayer plus tard" : ""}</p>
    <p>{!loading && data ? data.message : ""}</p>
    <p className="info">{info}</p>
    <form onSubmit={handleSubmit}>
      <label htmlFor="firstname">firstname: </label>
      <input type="text" name="firstname" id="firstname"  disabled={loading} onChange={(e) => setDataForm(prev => ({...prev, firstname: e.target.value}))}/>
      <label htmlFor="lastname">Lastname: </label>
      <input type="text" name="lastname" id="lastname"  disabled={loading} onChange={(e) => setDataForm(prev => ({...prev, lastname: e.target.value}))}/>
      <label htmlFor="email">email: </label>
      <input type="text" name="email" id="email"  disabled={loading} onChange={(e) => setDataForm(prev => ({...prev, email: e.target.value}))}/>
      <label htmlFor="pseudo">pseudo: </label>
      <input type="text" name="pseudo" id="pseudo"  disabled={loading} onChange={(e) => setDataForm(prev => ({...prev, pseudo: e.target.value}))}/>
      <label htmlFor="pass">Password</label>
      <input type="text" name="pass" id="pass" disabled={loading} onChange={(e) => setDataForm(prev => ({...prev, password: e.target.value}))}/>
      <button type="submit" disabled={loading}>{loading ? "Loading..." : "Inscription"}</button>
    </form>
    </>
  )
}

export default FormRegister