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
import ChatList from "./components/chatList";

function App() {
  const [display,setDisplay] = useState("")
  const [alert,setAlert] = useState({"style":"noDisplay","txt":"","functions":""})
  //Checking if user is logged in
  const [loggedIn,setLoggedIn] = useState(false)
  //Reloading user data
  if(loggedIn !== true && loggedIn !== false){
    setLoggedIn(true)
  }
  
  //Getting user data from database
  const [userData,setUserData] = useState([""])
  
  if(loggedIn === true && userData[0] === ""){
    const user = firebase.auth().currentUser
    let uData = []
    firebase.database().ref("users").child(user.uid).get().then((snapshot)=>{
      const importer = snapshot.val()
      if(snapshot.exists()){
        uData = {
          userName: importer.userName,
          userSurname: importer.userSurname,
          userDescription: importer.userDescription
        }
      }
    }).then(()=>{
      //Uptading user image and checking if it is added
      const userId = user.uid
      const storagePath =  firebase.storage().ref("users").child(userId)
      storagePath.getMetadata().then((meta)=>{
        if(meta.contentType !== "txt"){
          storagePath.getDownloadURL().then((url)=>{
            Object.assign(uData,{userProfilePicture: url})
            setUserData(uData)
          })
        }else {
            Object.assign(uData,{userProfilePicture: "pictures/no_profile_picture.png"})
            setUserData(uData)
        }
      }) 
    })
  }
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
      {(display === "ProfileSettings" && loggedIn)?<ProfileSettings display={display} userData={userData} loggedIn={setLoggedIn} setUserData={setUserData}/>: ""}
      {display.length > 20?<OtherUserProfile userId={display} />: ""}
      {(display === "" || display === "Login")?
          (<div id="defaultMiddleContent">
            <TopBar loggedIn={loggedIn} display={setDisplay}/>
            <AddPost loggedIn={loggedIn}/>
            <Posts loggedIn={loggedIn}/>
          </div>):""}

        <ChatList />
    </main>
    </AlertContext.Provider>
  );
}

export default App
