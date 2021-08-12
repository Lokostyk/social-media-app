import React,{useState} from 'react'
import firebase from 'firebase/app'

export default function RegisterForm() {
    const [email,setEmail] = useState("")
    const [password,setPassword] = useState("")
    const [password2,setPassword2] = useState("")
    
    function register(){
        if(password === password2){
            firebase.auth().createUserWithEmailAndPassword(email, password)
            .catch((error)=>{
                console.log(error)
            })
        }else{
            alert("Passwords must be the same!")
        }
    }
    return (
        <form className="form" onSubmit={(e)=> e.preventDefault()}>
            <label>E-mail</label>
            <input type="text" value={email} onChange={(e)=>setEmail(e.target.value)}/>
            <label>Password</label>
            <input type="text" value={password} onChange={(e)=>setPassword(e.target.value)}/>
            <label>Repeat Password</label>
            <input type="text" value={password2} onChange={(e)=>setPassword2(e.target.value)}/>
            <input type="submit" value="Register" onClick={register}/>
        </form>
    )
}
