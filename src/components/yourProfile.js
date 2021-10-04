import firebase from 'firebase/app'
import { useCallback } from 'react'

export default function YourProfile(props) {
    const signOut = useCallback(()=>{
        firebase.auth().signOut()
        .then(()=>{
            props.loggedIn(false)
            props.signOut("")
            window.location.reload()
        })
        .catch((error)=>{
            console.log(error)
        })
    },[props.loggedIn])
    return (
        <>{props.userData[0] !== ""?
            <div className="userWrapper">
                <img className="userImg" src={props.userData.userProfilePicture === ""?"pictures/no_profile_picture.png":props.userData.userProfilePicture} />
                <div className="userInfo" >{props.userData.userName} {props.userData.userSurname}</div>
                <button className="logInBtns" onClick={signOut}>Sign out</button>        
            </div>:
            <div className="loader">
                <div className="lds-roller white"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
            </div>
        }</>
    )
}
