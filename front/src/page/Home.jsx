import { useState } from "react"

import Login from "../component/loginForm/LoginForm"
import FormRegister from "../component/registerForm/RegisterForm"
import Switch from "../component/toggleForm/ToggleForm"

export function Home(){
    const [isLogForm, setIsLogForm] = useState(false)
    return(
        <>
            {/* <label htmlFor="filter" className="switch" aria-label="Toggle Filter">
                <input type="checkbox" id="filter" onChange={()=> setIsLogForm(!isLogForm)}/>
                <span>Inscription</span>
                <span>Connection</span>
            </label> */}
            <Switch bool= {isLogForm} setBool= {setIsLogForm}/>
            {isLogForm ? <Login/> : <FormRegister/>}
        </>
    )
}