import React,{useState} from 'react'
import firebase from 'firebase/app'
import 'firebase/database'

export default function RegisterInput(props) {
    const [name,setName] = useState("")
    const [surname,setSurname] = useState("")
    const [email,setEmail] = useState("")
    const [password,setPassword] = useState("")
    const [password2,setPassword2] = useState("")
    
    function register(){
        if(password === password2){
            firebase.auth().createUserWithEmailAndPassword(email, password)
            .then(()=>{
                const userId = firebase.auth().currentUser.uid
                firebase.database().ref("users/" + userId).set({
                    userName: name,
                    userSurname: surname,
                    userEmail: email
                }).then(()=>{
                    props.register("Login")
                })

            })
            .then(()=>{
                setName("")
                setSurname("")
                setEmail("")
                setPassword("")
                setPassword2("")
            })
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
                <h1>Create your account:</h1>
                <div>
                    <fieldset style={{marginRight: .5+"rem"}}>
                        <legend>Name</legend>
                    <input className="rInput" type="text" value={name} onChange={(e)=>setName(e.target.value)} required/><br />
                    </fieldset>
                    <fieldset style={{marginLeft: .5+"rem"}}>
                        <legend>Surname</legend>
                    <input className="rInput" type="text" value={surname} onChange={(e)=>setSurname(e.target.value)} required/><br />
                    </fieldset>
                </div>
                <fieldset>
                    <legend>E-mail</legend>
                    <input className="rInput" type="text" value={email} onChange={(e)=>setEmail(e.target.value)} required/><br />
                </fieldset>
                <fieldset>
                    <legend>Password</legend>
                        <input className="rInput" type="password" value={password} onChange={(e)=>setPassword(e.target.value)} required/><br />
                </fieldset>
                <fieldset>
                    <legend>Repeat password</legend>
                    <input className="rInput" type="password" value={password2} onChange={(e)=>setPassword2(e.target.value)} required/><br />
                </fieldset>
                <input className="rBtn" type="submit" value="Register" onClick={register}/>
            </form>
        </div>
    )
}
