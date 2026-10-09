import useController from "../../hook/useController"
import { useState } from "react"
import { apiService } from "../../services/apiService"
function Login() {
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

        const res = await loadFetch(query, info)
        console.log(res.status)
    }

  return (
    <div>
    <form onSubmit={handleSubmit}>
          <p className='load'>{loading? "Loading..." : ""}</p>
    <p className='err'>{errorMessage? "Erreur lors du chargement, veuillez réessayer plus tard" : ""}</p>
        <p>{message}</p>
        <label htmlFor="identifiant">Identifiant: </label>
        <input type="text" name="identifiant" id="identifiant"  onChange={(e) => setInfo(prev => ({...prev, identifiant: e.target.value}))}/>
        <label htmlFor="pass">Password</label>
        <input type="text" name="pass" id="pass" onChange={(e) => setInfo(prev => ({...prev, password: e.target.value}))}/>
        <button type="submit">Connexion</button>
    </form>
    
    </div>
  )
}

export default Login