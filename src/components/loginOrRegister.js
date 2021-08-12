import React, {useState} from "react"
import LoginForm from "./loginForm"
import RegisterForm from "./registerForm"

export default function LoginOrRegister(){
    const [display,setDisplay] = useState("")

    if(display === "Login"){
        return <LoginForm />
    }else if(display === "Register"){
        return <RegisterForm />
    }else {
        return (
            <div className="btns">
                <button onClick={()=> setDisplay("Login")}>Login</button>
                <button onClick={()=> setDisplay("Register")}>Register</button>
            </div>
        )
    }
}