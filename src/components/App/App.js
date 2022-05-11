import './App.css';
import Map from '../Map/Map';
import { IconContext } from "react-icons";

function App() {
  return (
    
    <IconContext.Provider value={{ color: "#ccc"}}>
    <div style={{width:"100vw", height:"100vh"}} className="App">
      <Map />
    </div>
    </IconContext.Provider>

  );
}

export default App;
