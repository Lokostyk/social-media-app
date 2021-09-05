import React, {useState} from "react"
import LoginForm from "./loginForm"
import YourProfile from "./yourProfile"

export default function LoginOrRegister(props){
    const [display,setDisplay] = useState("")
    if(display === "Login" || props.display === "Login"){
        return <LoginForm loggedIn={props.loggedIn} login={setDisplay}/>
    }else if(display === "Profile" && props.loggedIn){
        return <YourProfile userData={props.userData} loggedIn={props.loggedIn} signOut={setDisplay} />
    }else{
        return (
            <div className="btns">
                <button className="logInBtns" onClick={()=> setDisplay("Login")}>Log in</button>
                <button className="logInBtns" onClick={()=> props.register("Register")}>Register</button>
            </div>
        )
    }
}