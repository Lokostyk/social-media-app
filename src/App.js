import React,{ useState } from "react";
import firebase from "firebase"
import Menu from "./components/leftMenu"
import LoginOrRegister from "./components/loginOrRegister";
import RegisterForm from "./components/registerForm"
import ProfileSettings from "./components/profileSettings";

function App() {
  const [display,setDisplay] = useState("")
  //Checking if user is logged in
  const [loggedIn,setLoggedIn] = useState(false)

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
  }else {
    userData = {}
  }

  function renderMiddleContent(){
    if(display === "Register"){
      return <RegisterForm register={setDisplay} />
    }else if(display === "ProfileSettings" && loggedIn === true){
      return <ProfileSettings userData={userData}/>
    }else{
      return <div>middleMessages</div>
    }
  }
  return (
    <main>
      <div className="menu">
        <LoginOrRegister userData={userData} loggedIn={setLoggedIn} display={display} register={setDisplay} />
        <Menu display={setDisplay} />
      </div>
      {renderMiddleContent()}
      <div style={{position: "fixed",bottom: 0,right: 0}} >chatBoxes</div>
    </main>
  );
}

export default App;
