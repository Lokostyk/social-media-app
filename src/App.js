import { useState } from "react";
import Menu from "./components/leftMenu"
import LoginOrRegister from "./components/loginOrRegister";
import RegisterForm from "./components/registerForm"

function App() {
  const [display,setDisplay] = useState("")
  function renderMiddleContent(){
    if(display === "Register"){
      return <RegisterForm />
    }else{
      return <div>middleMessages</div>
    }
  }
  return (
    <main>
      <div className="menu">
        <LoginOrRegister register={setDisplay} />
        <Menu />
      </div>
      {renderMiddleContent()}
      <div style={{position: "fixed",bottom: 0,right: 0}} >chatBoxes</div>
    </main>
  );
}

export default App;
