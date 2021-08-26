import React,{ useState } from "react";
import firebase from "firebase/app"

import Alert from "./components/alert"
import { AlertContext } from "./Contexts/alert";
import Menu from "./components/leftMenu"
import LoginOrRegister from "./components/loginOrRegister";
import RegisterForm from "./components/registerForm"
import ProfileSettings from "./components/profileSettings";
import TopBar from "./components/topBar";
import Posts from "./components/posts";

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
  let userData = {}
  const [userName,setUserName] = useState("")
  const [userSurname,setUserSurname] = useState("")
  const [userProfilePicture,setUserProfilePicture] = useState("")
  if(loggedIn === true){
    const user = firebase.auth().currentUser
    userData = {
      userName,
      userSurname,
      userProfilePicture
    }
    firebase.database().ref("users").child(user.uid).get().then((snapshot)=>{
      const importer = snapshot.val()
      if(snapshot.exists()){
          setUserName(importer.userName)
          setUserSurname(importer.userSurname)
          setUserProfilePicture(importer.userPicture)
      }
    })
  }

  function renderMiddleContent(){
    if(display === "Register"){
      return <RegisterForm register={setDisplay} />
    }else if(display === "ProfileSettings" && loggedIn === true){
      return <ProfileSettings userData={userData} loggedIn={setLoggedIn}/>
    }else{
      return (
          <div>
            <TopBar />
            <Posts />
          </div>
        )
    }
  }
  return (
    <AlertContext.Provider value={setAlert}>
    <main>
      <Alert alert={alert} setAlert={setAlert} />
      <div className="menu">
        <LoginOrRegister userData={userData} loggedIn={setLoggedIn} display={display} register={setDisplay} />
        <Menu display={setDisplay} loggedIn={loggedIn}/>
      </div>

      {renderMiddleContent()}

      <div style={{position: "fixed",bottom: 0,right: 0}} >chatBoxes</div>
    </main>
    </AlertContext.Provider>
  );
}

export default App;
