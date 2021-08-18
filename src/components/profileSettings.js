import React,{useState} from 'react'
import firebase from 'firebase/app'

export default function ProfileSettings(props) {
    const user = firebase.auth().currentUser;
    const [inputState,setInputState] = useState(true)
    const [userName,setUserName] = useState(props.userData.userName)
    const [userSurname,setUserSurname] = useState(props.userData.userSurname)
    const [userEmail,setUserEmail] = useState(user.email)

    return (
        <div className="profileSet">
            <img className="profilePic" src={props.userData.userProfilePicture === undefined ? "no_profile_picture.png":props.userData.userProfilePicture} />
            <form className="formSet" onSubmit={(e)=> e.preventDefault()}>
                <div className="surName">
                    <input type="text" disabled={inputState} value={userName} onChange={(e)=>setUserName(e.value)} />
                    <input type="text" disabled={inputState} value={userSurname} onChange={(e)=>setUserSurname(e.value)} />
                </div>
                <input type="text" value={userEmail} onChange={(e)=>setUserEmail(e.value)} disabled={inputState}/>
                <textarea/>
                <div>
                    <input type="submit" disabled={inputState}/>
                    <button onClick={()=> setInputState(false)}>yoo</button>
                </div>
            </form>
        </div>
    )
}
