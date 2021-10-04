import React,{useState,useCallback} from 'react'
import firebase from 'firebase/app'
import 'firebase/database'
import 'firebase/storage'
import 'firebase/firestore'
import { AlertContext } from '../Contexts/alert'

export default function RegisterInput(props) {
    const [name,setName] = useState("")
    const [surname,setSurname] = useState("")
    const [email,setEmail] = useState("")
    const [password,setPassword] = useState("")
    const [password2,setPassword2] = useState("")
    const setAlert = React.useContext(AlertContext)

    const register = useCallback(()=>{
        if(password === password2){
            //Checking if name and surname contains only up to 15 letters
            if(/^[A-z]+$/i.test(name) && /^[A-z]+$/i.test(surname) 
            && surname.length <= 12 && name.length <= 12){
                firebase.auth().createUserWithEmailAndPassword(email, password)
                .then(()=>{
                    const userId = firebase.auth().currentUser.uid
                    firebase.storage().ref("users").child(userId).put("",{contentType:"txt"})
                    firebase.firestore().collection("chat").doc(firebase.auth().currentUser.uid).set({})
                    firebase.database().ref("users/" + userId).set({
                        userName: name,
                        userSurname: surname,
                        userEmail: email,
                        userDescription: "No user description"
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
            }else {
                setAlert({"style": "topAlert","txt":"Name and Surname can contain up to 12 letters!","functions":"delete"})
            }
        }else{
            setAlert({"style": "topAlert","txt":"Passwords must be the same!","functions":"delete"})
        }
    },[name,surname,email,password,password2])
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
