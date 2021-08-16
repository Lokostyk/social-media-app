import React, {useState} from "react"
import LoginForm from "./loginForm"
import Profile from "./profile"

export default function LoginOrRegister(props){
    const [display,setDisplay] = useState("")
    
    if(display === "Login" || props.display === "Login"){
        return <LoginForm login={setDisplay}/>
    }else if(display === "Profile"){
        return <Profile signOut={setDisplay} />
    }else{
        return (
            <div className="btns">
                <button onClick={()=> setDisplay("Login")}>Login</button>
                <button onClick={()=> props.register("Register")}>Register</button>
            </div>
        )
    }
}