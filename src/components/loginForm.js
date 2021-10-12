import React, { useState,useCallback,useContext } from 'react'
import firebase from 'firebase'
import app,{ auth } from "./firebase"
import { AlertContext } from '../Contexts/alert'

export default function LoginForm(props) {
    const [email,setEmail] = useState("")
    const [password,setPassword] = useState("")
    const setAlert = React.useContext(AlertContext)

    const login = useCallback(()=>{
        firebase.auth().signInWithEmailAndPassword(email, password)
        .then(()=>{
            if(firebase.auth().currentUser){
                props.login("Profile")
                props.loggedIn(true)
            }
        })
        .catch((error)=>{
            setAlert({"style": "topAlert","txt":"Wrong password or email!","functions":"delete"})
        })
    })
    return (
        <form className="loginForm" onSubmit={(e)=> e.preventDefault()}>
                <label>E-mail</label>
                <input type="text" value={email} onChange={(e)=>setEmail(e.target.value)} required/>
                <label>Password</label>
                <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} required/>
            <input type="submit" value="Log In" onClick={login}/>
        </form>
    )
}
