import React,{useState, useContext} from 'react'
import firebase from 'firebase/app'

export default function Profile(props) {
    function userPicture(){
        if(props.userData.userProfilePicture === undefined){
            return <img className="userImg" src="no_profile_picture.png"/>
        }
    }
    function signOut(){
        firebase.auth().signOut()
        .then(()=>{
            props.loggedIn(false)
            props.signOut("")
        })
        .catch((error)=>{
            console.log(error)
        })
    }
    return (
        <div className="userWrapper">
            {userPicture()}
            {value=>console.log(value)}
            <div className="userInfo" >{props.userData.userName} {props.userData.userSurname}</div>
            <button className="loginBtns" onClick={signOut}>Sign out</button>        
        </div>
    )
}
