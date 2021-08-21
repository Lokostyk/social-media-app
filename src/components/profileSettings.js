import React,{useState} from 'react'
import firebase from 'firebase/app'

export default function ProfileSettings(props) {
    const user = firebase.auth().currentUser;
    //User info
    const [inputState,setInputState] = useState(true)
    const [userName,setUserName] = useState(props.userData.userName)
    const [userSurname,setUserSurname] = useState(props.userData.userSurname)
    const [userDescription,setUserDescription] = useState("No user description")
    //Password and Email
    const [userEmail,setUserEmail] = useState(user.email)
    const [changePassword,setChangePassword] = useState(false)
    const [userPassword,setUserPassword] = useState("")
    const [newUserPassword,setNewUserPassword] = useState("")

    function submit(){
        if(/^[A-z]+$/i.test(userName) && /^[A-z]+$/i.test(userSurname) 
        && userSurname.length <= 15 && userName.length <= 15){
            firebase.database().ref("users/" + user.uid).set({
                userName,
                userSurname,
                userEmail,
            })
            //Changing email
            if(user.email !== userEmail){
                user.updateEmail(userEmail).catch(()=>alert("Something went wrong!! Please, refresh page"))
            }
            //Changing password
            if(changePassword){
                const credential = firebase.auth.EmailAuthProvider.credential(
                    firebase.auth().currentUser.email,
                    userPassword
                )
                user.reauthenticateWithCredential(credential).then(()=>{
                    user.updatePassword(newUserPassword)
                    setUserPassword("")
                    setNewUserPassword("")
                    setChangePassword(false)
                })
                .catch(()=>alert("Wrong password!"))
            }
            props.loggedIn("refresh")
            setInputState(true)
        }else {
            alert("Name and Surname can contain up to 15 LETTERS")
        }
    }
    function deleteAccount(){
        user.delete().then(()=>{
            alert("Account no longer exist.")
            props.loggedIn(false)
        })
    }
    return (
        <div className="profileSet">
            <form className="formSet" onSubmit={(e)=> e.preventDefault()}>
                <div className="surName">
                    <input type="text" disabled={inputState} value={userName} onChange={(e)=>setUserName(e.target.value)} required/>
                    <input type="text" disabled={inputState} value={userSurname} onChange={(e)=>setUserSurname(e.target.value)} required/>
                </div>
                <img className="profilePic" src={props.userData.userProfilePicture === undefined ? "pictures/no_profile_picture.png":props.userData.userProfilePicture}/>
                <textarea className="userDescripton" disabled={inputState} value={userDescription} onChange={(e)=>setUserDescription(e.target.value)}/>
                <input type="text" value={userEmail} onChange={(e)=>setUserEmail(e.target.value)} disabled={inputState} required/>
                <hr style={{width:80+"%",border: 1+"px solid #2b6777",margin: .5+"rem"}}/>
                <input type="checkbox" checked={changePassword} onChange={()=>setChangePassword(!changePassword)}/>
                    <label className={!changePassword ? "labelDisabled" : "labelEnabled"}>
                        <p>Old Password</p>
                        <input value={userPassword} onChange={(e)=>setUserPassword(e.target.value)} disabled={!changePassword}/>
                    </label>
                    <label className={!changePassword ? "labelDisabled" : "labelEnabled"}>
                    <p>New Password</p>
                    <input value={newUserPassword} onChange={(e)=>setNewUserPassword(e.target.value)} disabled={!changePassword}/>
                </label>
                <div className="profileBtns">
                    <input className="rBtn" type="submit" value="Save" onClick={submit} disabled={!(!inputState || changePassword)}/>
                    <button className="rBtn" onClick={()=> setInputState(!inputState)}>Edit</button>
                </div>
            </form>
            <button className="deleteAccount" onClick={deleteAccount}>Delete account</button>
        </div>
    )
}
