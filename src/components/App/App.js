import './App.css';
import Map from '../Map/Map';
import { ConfigProvider , App} from 'antd';
import { IconContext } from "react-icons";

function mainApp() {
  return (
    
    <IconContext.Provider value={{ color: "#ccc"}}>
      <ConfigProvider><App>
        <div style={{width:"100vw", height:"100vh"}} className="App">
          <Map />
        </div>
      </App></ConfigProvider>
    </IconContext.Provider>

  );
}

export default mainApp;
