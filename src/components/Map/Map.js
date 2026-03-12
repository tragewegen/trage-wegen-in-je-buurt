import React, { Component  } from "react";
import {FaCrosshairs} from "react-icons/fa";
import {initMap, drawLayer, marker, crossHair} from './initMap';
import TwMarker from '../../images/twMarker.svg';
import vectorsources from '../../vectorLayers';
import {VectorLegendSVG} from '../tools'
import Legend from '../Legend/Legend';
import Loader from '../Loader/Loader';
import { Modal, Layout, Button} from 'antd';
const { Content } = Layout;
import html2canvas from 'html2canvas';
import popup from "./popup";
//css
import 'ol/ol.css'; 
import './Map.css';


const MapLoader = () => {
  return (
    <div style={overlayStyle}>
      <div style={spinnerStyle}></div>
      <p style={{ color: '#fff', marginTop: '10px', fontWeight: 'bold' }}>
        Fetching GIS Data...
      </p>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

// --- Styles ---
const overlayStyle = {
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  backgroundColor: 'rgba(0, 0, 0, 0.5)', // Dim the map
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 1000, // Ensure it is above the OL layers
  pointerEvents: 'none', // Allows clicking through if needed
};

const spinnerStyle = {
  width: '50px',
  height: '50px',
  border: '5px solid #f3f3f3',
  borderTop: '5px solid #3498db', // Blue color
  borderRadius: '50%',
  animation: 'spin 1s linear infinite',
};

class Map extends Component {
    constructor(props) {
        super(props);
        this.state = {map: initMap() , 
                      loading: false, 
                      printing: false, 
                      popupTitle: '', 
                      popupContent:'', 
                      popupVisible: false };
        window.addEventListener("afterprint", () =>  this.setState({ printing: false}) );
        
        this.state.map.on('loadstart', ()=>  this.setState({ loading: true}));
        this.state.map.on('loadend', ()  =>  this.setState({ loading: false}));
    }

    componentDidMount(){
       let target = document.getElementById("olmap");
       this.state.map.setTarget(target);

       crossHair.setElement( document.getElementById('crosshair') );
       marker.setElement( document.getElementById('marker') );
       this.popup = new popup(this.state.map, this.infoFound);
     }
// TODO
    printer = async () => {
        let canvas = await html2canvas( this.state.map.getViewport(), {
            allowTaint: true,
            ignoreElements: element => {
                const className = typeof element.className == 'string'? element.className : '' ;
                return className.includes('ol-control', 0);
            }
        });
        let printNode = document.getElementById('printNode');
        this.setState({ printing: true})
        printNode.innerHTML = '' 
        printNode.append(canvas);
        setTimeout( window.print, 500);
    }

    infoFound = (title, content) => {
        this.setState({popupVisible: true, popupContent: content, popupTitle: title });
        document.getElementById('popContent').innerHTML = content;
    }

    closeModal = () => {
        this.setState({popupVisible: false})
        setTimeout(() => drawLayer.getSource().clear(), 1000 );
    }

    render() { 
        return <>
            <Modal title={this.state.popupTitle} onCancel={this.closeModal}
                   footer={<Button onClick={this.closeModal} >Sluiten</Button>} 
                   open={this.state.popupVisible}
                   styles={{ body: {height: document.body.scrollHeight /2 , overflowY: 'auto',  maxHeight: '70vh' } }}
                   forceRender>
                  <div id='popContent'></div>  
            </Modal>

            <span id='crosshair' ><FaCrosshairs size={18} color="red"/></span>
            <span id='marker' ><img src={TwMarker} width="18"  /></span>

            <div className="print-container" style={{display: this.state.printing ?'block':'none'}}>
                <h1>Trage Wegen</h1>
                <span id="printNode"/>
                <br/>
                {vectorsources.map(o => {
                    return <div key={o.id}> {/* <h2>{o.name}</h2> */}
                               {VectorLegendSVG(o.styleCache , 500)} 
                           </div>
                })}
            </div>

            <Layout style={{display: this.state.printing ?'none':'flex' }} >  {/**/}
                <Legend map={this.state.map} printFunc={this.printer} activeToolChange={tool => (this.popup.tool = tool)} />
                <Content > 
                    {this.state.loading && <Loader />}
                    <div id="olmap"></div> 
                </Content>
            </Layout>
         </>
    }
}

export default Map; 