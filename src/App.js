import Menu from "./components/leftMenu"

function App() {
  return (
    <main>
      <Menu />
      <div>middleMessages</div>
      <div style={{position: "fixed",bottom: 0,right: 0}} >chatBoxes</div>
    </main>
  );
}

export default App;
