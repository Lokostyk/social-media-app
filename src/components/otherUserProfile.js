import React from 'react'
import firebase from 'firebase/app'

export default function OtherUserProfile(props) {
    if(props.userId !== ""){
        firebase.database().ref("users").child(props.userId).get().then((snapshot)=> {
            console.log(snapshot)
        })
    }
    return (
        <div>
            yo
        </div>
    )
}
