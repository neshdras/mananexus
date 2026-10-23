import { useEffect, useState } from "react"

import Login from "../component/loginForm/LoginForm"
import FormRegister from "../component/registerForm/RegisterForm"
import Switch from "../component/toggleForm/ToggleForm"
export function Form(){
        const [isLogForm, setIsLogForm] = useState(false)
        useEffect(()=>{
            document.title= isLogForm ? 'Nexus Shuffle | Connexion' : 'Nexus Shuffle | Inscription'
        }, [isLogForm])
    return(
        <>
            <Switch bool= {isLogForm} setBool= {setIsLogForm}/>
            {isLogForm ? <Login/> : <FormRegister/>}
        </>
    )
}