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
        <div className="wrapper">
            <form className="wrapper--form" onSubmit={(e)=> e.preventDefault()}>
                <label>E-mail
                <input type="text" value={email} onChange={(e)=>setEmail(e.target.value)} required/><br />
                </label>
                <label>Password
                <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} required/><br />
                </label>
                <label>Repeat Password
                <input type="password" value={password2} onChange={(e)=>setPassword2(e.target.value)} required/><br />
                </label>
                <input type="submit" value="Register" onClick={register}/>
            </form>
        </div>
    )
}
