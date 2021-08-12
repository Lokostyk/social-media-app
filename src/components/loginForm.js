import React, { useState } from 'react'
import firebase from 'firebase'
import app,{ auth } from "./firebase"

export default function LoginForm() {
    const [email,setEmail] = useState("")
    const [password,setPassword] = useState("")

    function login(){
        firebase.auth().signInWithEmailAndPassword(email, password)
        .then()
        .catch((error)=>{
            console.log(error)
        })
    }
    return (
        <form className="form" onSubmit={(e)=> e.preventDefault()}>
            <label>E-mail</label>
            <input type="text" value={email} onChange={(e)=>setEmail(e.target.value)}/>
            <label>Password</label>
            <input type="text" value={password} onChange={(e)=>setPassword(e.target.value)}/>
            <input type="submit" value="Log In" onClick={login}/>
        </form>
    )
}
