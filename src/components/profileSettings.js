import React,{useState} from 'react'
import firebase from 'firebase/app'

export default function ProfileSettings(props) {
    const user = firebase.auth().currentUser;
    const [inputState,setInputState] = useState(true)
    const [userName,setUserName] = useState(props.userData.userName)
    const [userSurname,setUserSurname] = useState(props.userData.userSurname)
    const [userEmail,setUserEmail] = useState(user.email)

    function submit(){
        setInputState(true)
    }
    return (
        <div className="profileSet">
            <form className="formSet" onSubmit={(e)=> e.preventDefault()}>
                <div className="surName">
                    <input type="text" disabled={inputState} value={userName} onChange={(e)=>setUserName(e.value)} />
                    <input type="text" disabled={inputState} value={userSurname} onChange={(e)=>setUserSurname(e.value)} />
                </div>
            <img className="profilePic" src={props.userData.userProfilePicture === undefined ? "no_profile_picture.png":props.userData.userProfilePicture} />
                <textarea className="userDescripton" disabled={inputState} value="No user description"/>
                <input type="text" value={userEmail} onChange={(e)=>setUserEmail(e.value)} disabled={inputState}/>
                <div className="profileBtns">
                    <input className="rBtn" type="submit" value="Save" onClick={submit} disabled={inputState}/>
                    <button className="rBtn" onClick={()=> setInputState(false)}>Edit</button>
                </div>
            </form>
        </div>
    )
}
