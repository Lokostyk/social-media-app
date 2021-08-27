import firebase from 'firebase/app'

export default function YourProfile(props) {
    function userPicture(){
        if(props.userData.userProfilePicture === ""){
            return <img className="userImg" src="pictures/no_profile_picture.png"/>
        }else {
            return <img className="userImg" src={props.userData.userProfilePicture} />
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
