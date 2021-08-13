import React from 'react'
import firebase from 'firebase/app'

export default function Profile(props) {
    const user = firebase.auth().currentUser
    function signOut(){
        firebase.auth().signOut()
        .then(()=>{
            console.log("user logout")
            props.signOut("")
        })
        .catch((error)=>{
            console.log(error)
        })
    }
    return (
        <div>
            {user.uid}
            <button onClick={signOut}>Sign out</button>        
        </div>
    )
}
