import React,{ useState,useEffect } from "react";
import firebase from "firebase/app"

import Alert from "./components/alert"
import { AlertContext } from "./Contexts/alert";
import Menu from "./components/leftMenu"
import LoginOrRegister from "./components/loginOrRegister";
import RegisterForm from "./components/registerForm"
import ProfileSettings from "./components/profileSettings";
import TopBar from "./components/topBar";
import Posts from "./components/posts";
import OtherUserProfile from "./components/otherUserProfile"
import AddPost from "./components/addPost";

function App() {
  //Checking if user is logged in
  const [loggedIn,setLoggedIn] = useState(false)
  //Reloading user data
  if(loggedIn !== true && loggedIn !== false){
    setLoggedIn(true)
  }
  
  //Getting user data from database
  let userData = {}
  const [userName,setUserName] = useState("")
  const [userSurname,setUserSurname] = useState("")
  const [userProfilePicture,setUserProfilePicture] = useState("")
  const [userDescription,setUserDescription] = useState("")
  
  if(loggedIn === true){
    const user = firebase.auth().currentUser
    userData = {
      userName,
      userSurname,
      userProfilePicture,
      userDescription
    }
    firebase.database().ref("users").child(user.uid).get().then((snapshot)=>{
      const importer = snapshot.val()
      if(snapshot.exists()){
        setUserName(importer.userName)
        setUserSurname(importer.userSurname)
        setUserDescription(importer.userDescription)
      }
    })
    //Uptading user image and checking if it is added
    const userId = user.uid
    const storagePath =  firebase.storage().ref("users").child(userId)
    storagePath.getMetadata().then((meta)=>{
      if(meta.contentType !== "txt"){
        storagePath.getDownloadURL().then((url)=>{
          setUserProfilePicture(url)
        })
      }else {
        setUserProfilePicture("pictures/no_profile_picture.png")
      }
    }) 
  }
  
  const [display,setDisplay] = useState("")
  const [alert,setAlert] = useState({"style":"noDisplay","txt":"","functions":""})
    return (
      <AlertContext.Provider value={setAlert}>
    <main>
      <Alert alert={alert} setAlert={setAlert} />
      <div className="menu">
        <LoginOrRegister userData={userData} loggedIn={setLoggedIn} display={display} register={setDisplay} />
        <Menu display={setDisplay} loggedIn={loggedIn}/>
      </div>
      {/* ******** Middle content ******** */}
      {display === "Register"? <RegisterForm display={display} register={setDisplay} />: ""}
      {display === "ProfileSettings"?<ProfileSettings display={display} userData={userData} loggedIn={setLoggedIn}/>: ""}
      {display.length > 20?<OtherUserProfile userId={display} />: ""}
      {display === ""?
          (<div>
            <TopBar loggedIn={loggedIn} display={setDisplay}/>
            <AddPost loggedIn={loggedIn}/>
            <Posts loggedIn={loggedIn}/>
          </div>):""}

      <div style={{position: "fixed",bottom: 0,right: 0}} >chatBoxes</div>
    </main>
    </AlertContext.Provider>
  );
}

export default App
