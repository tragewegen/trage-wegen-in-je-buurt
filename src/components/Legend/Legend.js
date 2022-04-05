//import UI
import React, { Component  } from "react";
import { AutoComplete, Layout, Menu, Checkbox, Popover, message } from 'antd';
const { Sider } = Layout;
const { SubMenu } = Menu;

//import icons and css
import { FiLayers } from "react-icons/fi";
import { FaMap, FaSearch, FaList, FaTools,
                  FaRulerCombined, FaRuler} from "react-icons/fa";
import {FiPrinter, FiCalendar} from "react-icons/fi";
import 'antd/dist/antd.css';
import "./Legend.css";
import logo from '../../images/logo.svg';

// maps 
import {background, drawLayer, viewer} from '../Map/initMap';
import {addVectorLayer, urlParams, VectorLegendSVG, lineLength, polygonArea} from '../tools'
import {fromLonLat} from 'ol/proj';
import vectorsources from '../../vectorLayers';
import {baselayers, histolayers} from '../../baseLayers';
import {addMeasureLine, addMeasureArea, removeMeasure} from './DrawTool'

class Legend extends Component {
   constructor(props) {
      super(props);
      this.intialParams = urlParams();
      this.state = { menuCollapse: innerWidth < 600, adressuggestions: [],
                     map: props.map, activeTool: 'identify', 
                     vectors: vectorsources.map(o => {
                               o.lyr = addVectorLayer(props.map, o.source, o.style, o.name, o.minZ); 
                               return o;}),
                     basemap: 'tw_Mapbox',
                     basemaps: baselayers, histomaps: histolayers
                    };     
    }
  componentDidMount() {
     if(this.intialParams.center ) { viewer.setCenter( this.intialParams.center ); }
     if(this.intialParams.zoom ) { viewer.setZoom( this.intialParams.zoom ); }
  }

  adresSearchChange = async val => {
      let geoUri = "https://loc.geopunt.be/v4/Suggestion?q=" + val;
      let resp= await fetch(geoUri).then(r => r.json());
      this.setState({adressuggestions: resp.SuggestionResult.map(e => ( {value: e} )) }) 
    }
  adresSearchSelect = async () => {
      if( this.state.adressuggestions.length == 0 ){ return; }
      let q = this.state.adressuggestions[0].value;
      let geoUri = "https://loc.geopunt.be/v4/Location?q=" + q;
      let resp= await fetch(geoUri).then(r => r.json());
      if(resp.LocationResult.length == 0){ return; }
      let geoLoc = resp.LocationResult[0];
      //let center  = fromLonLat([geoLoc.Location.Lon_WGS84, geoLoc.Location.Lat_WGS84]);
      let LowerLeft = fromLonLat([geoLoc.BoundingBox.LowerLeft.Lon_WGS84, geoLoc.BoundingBox.LowerLeft.Lat_WGS84]);
      let UpperRight = fromLonLat([geoLoc.BoundingBox.UpperRight.Lon_WGS84, geoLoc.BoundingBox.UpperRight.Lat_WGS84]);
      let bbox = [LowerLeft[0] -50, LowerLeft[1] -50,
                   UpperRight[0]+50, UpperRight[1] +50];
      viewer.fit(bbox);	
    }
  toggleVector = idx => {
      let vectors = this.state.vectors;
      let v = !vectors[idx].lyr.getVisible();
      vectors[idx].lyr.setVisible( v );
      this.setState({vectors:vectors});
    }
  activateBasemap = (lyrId, sublayer) => {
      this.setState({basemap:lyrId});
      if(sublayer == 'base'){
        let lyr = this.state.basemaps.find( e=> (e.id == lyrId));
        background.setSource(lyr.source);
      }
      else if(sublayer == 'histo'){
        let lyr = this.state.histomaps.find( e=> (e.id == lyrId));
        background.setSource(lyr.source);
      }
    }

  setActiveTool = tool => {
    this.setState({activeTool: tool });
    this.props.activeToolChange( tool );
  }
  measureLine = () => {
    if(this.state.activeTool == 'meten'){ 
      this.setActiveTool('identify');
      removeMeasure(this.state.map);
      drawLayer.getSource().clear();
      message.destroy();
    }
    else{ 
      this.setState({activeTool: 'meten'  }); 
      this.setActiveTool( 'meten' );
      addMeasureLine(this.state.map, feat => {
            let geom = feat.getGeometry();
            let msgCfg = {
              icon: <FaRuler />,
              content: ` Gemeten afstand: ${lineLength(geom)} m`,
              style: {marginTop: '20vh'}, 
              onClick: () => {message.destroy(); drawLayer.getSource().clear();}
            }
            message.info(msgCfg, 0)
      });
    }
  }  
  measureArea = () => {
    if(this.state.activeTool == 'area'){ 
      this.setActiveTool('identify');
      removeMeasure(this.state.map);
      drawLayer.getSource().clear();
      message.destroy();
    }
    else{ 
      this.setActiveTool('area');
      addMeasureArea(this.state.map, feat => {
            let geom = feat.getGeometry();
            let msgCfg = {
              icon: <FaRulerCombined />,
              content: ` Gemeten oppervlakte: ${polygonArea(geom)} m²`,
              style: {marginTop: '20vh'}, 
              onClick: () => {message.destroy(); drawLayer.getSource().clear();}
            }
            message.info(msgCfg, 0)
      });
    }
  }  

  render() {
    
    let adresBar = <AutoComplete  style={{padding:10, width: 240 }}  
                      onChange={this.adresSearchChange} 
                      onSelect={this.adresSearchSelect}
                      onKeyDown={e =>{ if(e.key === 'Enter') this.adresSearchSelect(); } } 
                      notFoundContent="Geen adressen gevonden"
                      options={this.state.adressuggestions} 
                      placeholder="Zoek een Adres" />
    let adresNode = adresBar; 

    let toolbar = <div id='toolbar' >  
                      <FiPrinter title='Printen'style={{cursor:"pointer"}} size={22}
                                 className="tool" onClick={this.props.printFunc} />
                      <FaRuler title='Afstand Meten' style={{cursor:"pointer"}} size={22}
                                 className={this.state.activeTool == 'meten'? 'toggle activeTool': 'toggle'} 
                                 onClick={this.measureLine} />
                      <FaRulerCombined title='Oppervlakte Meten' style={{cursor:"pointer"}} size={22}
                                 className={this.state.activeTool == 'area'? 'toggle activeTool': 'toggle'} 
                                 onClick={this.measureArea} />
                  </div>
    let toolNode = toolbar;

{/* change in Popover on collapse */}
    if(this.state.menuCollapse){
      adresNode = <Popover  color={'#002140'} placement="left" content={adresBar}> 
                      <div style={{padding: '20px'}} ><FaSearch /></div> 
                  </Popover>
      toolNode = <Popover color={'#002140'} placement="left" content={toolNode}> 
                    <div style={{padding: '20px'}} ><FaTools /></div> 
                </Popover>

    }
{/* render legende */}
    return (
          <Sider collapsible collapsed={this.state.menuCollapse} theme="dark"
                 onCollapse={c => this.setState({menuCollapse:c})}
                 style={{height:"100vh", overflowY:'auto', overflowX: 'hidden'}}
                 width={240} className="site-layout-background">
              <div style={{paddingTop: 10, display: this.intialParams.logo ? "block" : 'none'  }} >
                  <img src={logo} id="Logo" style={{width: this.state.menuCollapse ? 40 : 100, alignSelf: 'center' }} />
              </div> 

              {adresNode}
              {toolNode}

              <Menu mode="inline"  inlineIndent={10} theme="dark"
                  defaultOpenKeys={this.state.menuCollapse ? []:['layers']} >
                <SubMenu key="layers" title="Lagen" icon={<FiLayers />} > 
                  {this.state.vectors.map( (o,i) => {
                        return (
                        <Menu.Item key={o.id} disabled style={{cursor:"pointer"}} >
                           <Checkbox className="vectorChk"
                                    onChange={() => this.toggleVector(i)} 
                                    checked={this.state.vectors[i].lyr.getVisible() }>
                              {o.name}
                           </Checkbox>
                           <Popover placement="bottomLeft" color="#8d85cfdd" title='Legende' zIndex={9999}
                                   content={VectorLegendSVG(o.styleCache , 500)} >
                              <FaList  />
                           </Popover>
                        </Menu.Item>
                        )
                  })}
                  </SubMenu>

                  <SubMenu key="histomap" title="Historische kaarten" icon={<FiCalendar />} >
                  {this.state.histomaps.map( (o,i) => {
                        return ( 
                        <Menu.Item className={ this.state.basemap == o.id  ?"ant-menu-item-selected":''}
                          onClick={() => this.activateBasemap(o.id, 'histo')} key={o.id} >
                            {o.name}
                        </Menu.Item> 
                        )	
                  })}
 
                  </SubMenu>
                  <SubMenu key="background" title="Achtergrond kaarten" icon={<FaMap />} >
                  {this.state.basemaps.map( (o,i) => {
                        return ( 
                        <Menu.Item className={ this.state.basemap == o.id  ?"ant-menu-item-selected":''}
                          onClick={() => this.activateBasemap(o.id, 'base')} key={o.id} >
                            {o.name}
                        </Menu.Item> 
                        )	
                  })}
 
                  </SubMenu>
                  <Menu.Item key='padding' style={{cursor:"pointer"}} disabled />
              </Menu>
          </Sider> )
    }
}
export default Legend;