import { useState } from "react";
import Menu from "./components/leftMenu"
import LoginOrRegister from "./components/loginOrRegister";
import RegisterForm from "./components/registerForm"

function App() {
  const [display,setDisplay] = useState("")

  function renderMiddleContent(){
    if(display === "Register"){
      return <RegisterForm register={setDisplay} />
    }else{
      return <div>middleMessages</div>
    }
  }
  return (
    <main>
      <div className="menu">
        <LoginOrRegister display={display} register={setDisplay} />
        <Menu />
      </div>
      {renderMiddleContent()}
      <div style={{position: "fixed",bottom: 0,right: 0}} >chatBoxes</div>
    </main>
  );
}

export default App;
