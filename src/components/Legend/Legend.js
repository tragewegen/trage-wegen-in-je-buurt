//import UI
import React, { Component  } from "react"; 
import { AutoComplete, Slider, Layout, Menu, Checkbox, Popover, message } from 'antd';
const { Sider } = Layout;
const { SubMenu } = Menu;

//import icons and css
import { FiLayers } from "react-icons/fi";
import { FaMap, FaSearch, FaList, FaTools, FaShareSquare, FaCrosshairs,
                  FaRulerCombined, FaRuler} from "react-icons/fa";
import {FiPrinter, FiCalendar} from "react-icons/fi";
import 'antd/dist/antd.css';
import "./Legend.css";
import logo from '../../images/logo.svg';

// maps 
import {background, histo, drawLayer, viewer, geolocation} from '../Map/initMap';
import {addVectorLayer, urlParams, VectorLegendSVG, lineLength, polygonArea} from '../tools';
import {suggest_osm, geocode_osm} from '../geocoder';
import {toLonLat} from 'ol/proj';
import vectorsources from '../../vectorLayers';
import {baselayers, histolayers} from '../../baseLayers';
import {addMeasureLine, addMeasureArea, removeMeasure} from './DrawTool';

class Legend extends Component {
   constructor(props) {
      super(props);
      this.intialParams = urlParams();
      this.state = { menuCollapse: innerWidth < 600, adressuggestions: [],
                     map: props.map, activeTool: 'identify', 
                     vectors: vectorsources.map(o => {
                        o.lyr = addVectorLayer(props.map, o.source, o.style, o.name, o.minZ, 
                            this.intialParams.layers.find(e => e == o.id) ? true : false); 
                        return o;}),
                     basemap: this.intialParams.basemap,
                     histomap: this.intialParams.histomap,
                     basemaps: baselayers, 
                     histomaps: histolayers
                    };                           
    }


  componentDidMount() {
     if(this.intialParams.center ) { viewer.setCenter( this.intialParams.center ); }
     if(this.intialParams.zoom ) { viewer.setZoom( this.intialParams.zoom ); }

     viewer.on('change', () => {
      let z = viewer.getZoom().toFixed(2);
      let lyrs = this.state.vectors.filter(e => e.lyr.getVisible()).map(e => e.id).join(',')
      let xy = toLonLat( viewer.getCenter() );
      let x = xy[0].toFixed(6); 
      let y = xy[1].toFixed(6);
      let qry = this.qryString(x,y,z,lyrs);
      let newurl = location.protocol + "//" + location.host + location.pathname + qry;
      history.pushState({path:newurl},'',newurl);
  } );
  }

  componentDidUpdate() {
    viewer.changed();
  }

 qryString = (x,y,z,lyrs) => {
    let qry = {'logo': this.intialParams.logo, 
               'lyrs': lyrs, 'base': this.state.basemap, 'histo': this.state.histomap, 'histTrans': histo.getOpacity(),
                'x': x, 'y': y, 'z':z 
               }
    if(this.intialParams.marker){
      let marker = toLonLat( this.intialParams.marker );
      qry["marker_lng"] = marker[0].toFixed(6);
      qry["marker_lat"] = marker[1].toFixed(6);
    }
    return '?' + new URLSearchParams(qry).toString();
  }

  adresSearchChange = async val => {
      if (val.length <= 3) {return;}
      let suggestions = await suggest_osm(val);
      this.setState({adressuggestions: suggestions });
  }

  adresSearchSelect = async () => {
      if( this.state.adressuggestions.length == 0 ){ return; }
      let q = this.state.adressuggestions[0].value;
      let adres = await geocode_osm(q);
      console.log(adres)
      viewer.fit(adres.bbox);	
    }

  toggleVector = idx => {
      let vectors = this.state.vectors;
      let v = !vectors[idx].lyr.getVisible();
      vectors[idx].lyr.setVisible( v );
      this.setState({vectors:vectors});
    }

  setVectorTrans = (idx, o) => {
      let vectors = this.state.vectors;
      vectors[idx].lyr.setOpacity( o );
      this.setState({vectors:vectors});
    }

  activateBasemap = lyrId => {
      this.setState({basemap:lyrId});
      let lyr = this.state.basemaps.find( e=> (e.id == lyrId));
      background.setSource(lyr.source);
    }

  activateHistomap = lyrId => {
      this.setState({histomap:lyrId});
      let lyr = this.state.histomaps.find( e=> (e.id == lyrId) );
      histo.setSource(lyr.source);
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

  geolocation = () => {
    if( geolocation.getTracking()){
          let xy = geolocation.getPosition(); 
          viewer.animate({zoom: viewer.getZoom() +2, center:xy });
          } 
    else {
          geolocation.setTracking( true );
          geolocation.once('change:position', () => {
            let xy = geolocation.getPosition(); 
            viewer.animate({zoom: viewer.getZoom() +2, center:xy });      
          });
        }
  } 

  share = async () => {
    await navigator.clipboard.writeText(document.location.href);
    message.success(<>
      De <a target='_blank' href={document.location.href} >Link</a> naar de kaart werd naar het klembord gestuurd<br/>
     </>, 2);
  }

  render() {
    
    let legendeCaption = i => <> Legende  
                      <span style={{right:5, top: 5, position: 'absolute'}}>
                           <Slider style={{display: 'inline-block', width: 180}}  min={-100} max={0} defaultValue={-100}
                                   tooltip={{'formatter': val => `transparantie ${100 +val}%`}}
                                   onAfterChange={o => this.setVectorTrans(i, o/-100)}/> 
                      </span>
                    </>

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
                      <FaShareSquare title='Kaart delen' className="toggle" size={22}
                                 onClick={this.share}/> 
                      <FaCrosshairs title='Zoom naar huidige geolocatie' className="toggle" size={22} 
                                 onClick={this.geolocation}/> 
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
                           <Popover  title={legendeCaption(i)}
                                   zIndex={9999} placement="bottomLeft" color="#8d85cfdd"
                                   content={VectorLegendSVG(o.styleCache , 500)} >
                              <FaList  />
                           </Popover>
                        </Menu.Item>
                        )
                  })}
                  </SubMenu>

                  <SubMenu key="histomap" title="Historische kaarten" icon={<FiCalendar />} >
                    <Menu.Item  key={'transparencySlider'} disabled style={{cursor:"pointer"}} title='transparantie' >
                      <Slider 
                        tooltip={{'formatter': val => `transparantie ${100 +val}%`}}
                        defaultValue={ histo.getOpacity()*-100 } min={-100} max={0} step={1} 
                        onAfterChange={o => ( histo.setOpacity( o / -100 ) || viewer.changed() )} >
                        </Slider>
                     </Menu.Item> 
                  {this.state.histomaps.map( o => {
                        return ( 
                        <Menu.Item className={ this.state.histomap == o.id  ?"ant-menu-item-selected":''}
                          onClick={() => this.activateHistomap(o.id)} key={o.id} >
                            {o.name}
                        </Menu.Item> 
                        )	
                  })}
 
                  </SubMenu>
                  <SubMenu key="background" title="Achtergrond kaarten" icon={<FaMap />} >
                  {this.state.basemaps.map( o => {
                        return ( 
                        <Menu.Item className={ this.state.basemap == o.id  ?"ant-menu-item-selected":''}
                          onClick={() => this.activateBasemap(o.id)} key={o.id} >
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