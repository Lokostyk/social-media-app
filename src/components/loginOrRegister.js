import React, {useState} from "react"
import LoginForm from "./loginForm"
import Profile from "./profile"

export default function LoginOrRegister(props){
    const [display,setDisplay] = useState("")
    if(display === "Login" || props.display === "Login"){
        return <LoginForm loggedIn={props.loggedIn} login={setDisplay}/>
    }else if(display === "Profile"){
        return <Profile userData={props.userData} loggedIn={props.loggedIn} signOut={setDisplay} />
    }else{
        return (
            <div className="btns">
                <button className="loginBtns" onClick={()=> setDisplay("Login")}>Login</button>
                <button className="loginBtns" onClick={()=> props.register("Register")}>Register</button>
            </div>
        )
    }
}