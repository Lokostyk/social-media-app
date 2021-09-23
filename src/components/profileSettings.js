import React,{useState , useContext, useCallback} from 'react'
import firebase from 'firebase/app'
import { AlertContext } from '../Contexts/alert'
import "firebase/storage";


export default function ProfileSettings(props) {
    const user = firebase.auth().currentUser;
    const setAlert = useContext(AlertContext)
    //User info
    const [displayState,setdisplayState] = useState(true)
    const [userName,setUserName] = useState(props.userData.userName)
    const [userSurname,setUserSurname] = useState(props.userData.userSurname)
    const [userDescription,setUserDescription] = useState(props.userData.userDescription)
    const [userImg,setUserImg] = useState(props.userData.userProfilePicture)
    //Password and Email
    const [userEmail,setUserEmail] = useState(user.email)
    const [changePassword,setChangePassword] = useState(false)
    const [userPassword,setUserPassword] = useState("")
    const [newUserPassword,setNewUserPassword] = useState("")
    
    const submit = useCallback(()=>{
        if(/^[A-z]+$/i.test(userName) && /^[A-z]+$/i.test(userSurname) 
        && userSurname.length <= 15 && userName.length <= 15){
            firebase.database().ref("users/" + user.uid).set({
                userName,
                userSurname,
                userEmail,
                userDescription
            })
            //Changing email
            if(user.email !== userEmail){
                user.updateEmail(userEmail).catch(()=> setAlert({"style": "topAlert","txt":"Something went wrong!! Please, refresh page.","functions":"delete"}))
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
                .catch(()=>setAlert({"style": "topAlert","txt":"Wrong password!","functions":"delete"}))
            }
            props.loggedIn("refresh")
            setdisplayState(true)
        }else {
            setAlert({"style": "topAlert","txt":"Name and Surname can contain up to 15 letters!","functions":"delete"})
        }
    },[userName,userSurname,userEmail,userDescription,changePassword,userPassword,newUserPassword])
    function deleteAccount(){
        user.delete().then(()=>{
            setAlert({"style": "topAlert","txt":"Account no longer exist.","functions":"delete"})
            props.loggedIn(false)
        })
    }
    const handleImageChange = useCallback((e)=> {
        const userId = firebase.auth().currentUser.uid
        firebase.storage().ref("users").child(userId).put(e.target.files[0])
        setUserImg(URL.createObjectURL(e.target.files[0]))
    },[userImg])
    return (
        <div className="profileSet">
            <form className="formSet" onSubmit={(e)=> e.preventDefault()}>
                <div className="surName">
                    <input type="text" disabled={displayState} value={userName} onChange={(e)=>setUserName(e.target.value)} required/>
                    <input type="text" disabled={displayState} value={userSurname} onChange={(e)=>setUserSurname(e.target.value)} required/>
                </div>
                <label className="profilePic">
                    <input type="file" onChange={handleImageChange} accept="image/png, image/jpeg"/>
                    <img src={userImg} />
                    <div className="editPic">
                        <img src="pictures/edit.svg" /> 
                    </div>
                </label>
                <textarea className="userDescripton" disabled={displayState} value={userDescription} onChange={(e)=>setUserDescription(e.target.value)}/>
                <input type="text" value={userEmail} onChange={(e)=>setUserEmail(e.target.value)} disabled={displayState} required/>
                <hr style={{width:80+"%",border: 1+"px solid #2b6777",margin: .5+"rem"}}/>
                <input type="checkbox" checked={changePassword} onChange={()=>setChangePassword(!changePassword)}/>
                    <label className={!changePassword ? "labelDisabled" : "labelEnabled"}>
                        <p>Old Password</p>
                        <input type="password" value={userPassword} onChange={(e)=>setUserPassword(e.target.value)} disabled={!changePassword}/>
                    </label>
                    <label className={!changePassword ? "labelDisabled" : "labelEnabled"}>
                    <p>New Password</p>
                    <input type="password" value={newUserPassword} onChange={(e)=>setNewUserPassword(e.target.value)} disabled={!changePassword}/>
                </label>
                <div className="profileBtns">
                    <input className="rBtn" type="submit" value="Save" onClick={submit} disabled={!(!displayState || changePassword)}/>
                    <button className="rBtn" onClick={()=> setdisplayState(!displayState)}>Edit</button>
                </div>
            </form>
            <button className="deleteAccount" onClick={deleteAccount}>Delete account</button>
        </div>
    )
}
