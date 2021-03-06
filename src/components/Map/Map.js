import React, { Component  } from "react";
import {FaCrosshairs} from "react-icons/fa";
import {initMap, drawLayer, marker} from './initMap';
import vectorsources from '../../vectorLayers';
import {VectorLegendSVG} from '../tools'
import Legend from '../Legend/Legend';
import { Modal, Layout, Button} from 'antd';
const { Content } = Layout;
import html2canvas from 'html2canvas';
import popup from "./popup";
//css
import 'ol/ol.css'; 
import './Map.css';
import 'antd/dist/antd.css';

class Map extends Component {
    constructor(props) {
        super(props);
        this.state = {map: initMap() , printing: false, 
            popupTitle: '', popupContent:'', popupVisible: false };
        window.addEventListener("afterprint", () =>  this.setState({ printing: false}) );
    }

    componentDidMount(){
       let target = document.getElementById("olmap");
       this.state.map.setTarget(target);
       marker.setElement( document.getElementById('crosshair') )
       this.popup = new popup(this.state.map, this.infoFound);
     }

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
                   visible={this.state.popupVisible}
                   bodyStyle={{height: document.body.scrollHeight /2 , overflowY:'scroll'}}
                   >
                  <div id='popContent'></div>  
            </Modal>

            <span id='crosshair' ><FaCrosshairs size={18} color="red"/></span>

            <div style={{display: this.state.printing ?'block':'none'}}>
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
                    <div id="olmap"></div> 
                </Content>
            </Layout>
         </>
    }
}

export default Map; 