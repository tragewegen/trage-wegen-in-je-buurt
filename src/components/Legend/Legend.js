//import UI
import React, { Component  } from "react"; 
import { AutoComplete, Slider, Layout, Menu, Checkbox, Popover, App, Divider } from 'antd';
const { Sider } = Layout;

//import icons and css
import { FiLayers } from "react-icons/fi";
import { FaMap, FaSearch, FaList, FaTools, FaShareSquare, FaCrosshairs,
                FaRulerCombined, FaRuler} from "react-icons/fa";
import {FiPrinter, FiCalendar} from "react-icons/fi";

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
import _ from 'lodash'; 


class Legend extends Component {
   constructor(props) {
      super(props);
      this.intialParams = urlParams();
      this.messageBox  = (info, durationTime) => {
        this.props.antdMessage.info( {
          content: info, 
          style: {marginTop: '20vh'}, 
          duration: durationTime, 
          onClick: () => {
            this.props.antdMessage.destroy();
            drawLayer.getSource().clear();
          }
            
        });
      };
      
      this.debouncedSearch = _.debounce(this.performSearch, 400);
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

  performSearch = async (val) => {
    try {
      const suggestions = await suggest_osm(val);
      this.setState({ adressuggestions: suggestions });
    } catch (error) {
      console.error("OSM Search Error:", error);
    }
  };

  adresSearchChange = async val => {
      if ( val && val.length <= 3) {
        this.setState({ adressuggestions: [] });
        return;
      }
      this.debouncedSearch(val);
  }

  adresSearchSelect = async () => {
      if( this.state.adressuggestions.length == 0 ){ return; }
      let q = this.state.adressuggestions[0].value;
      let adres = await geocode_osm(q);
      this.messageBox(adres.adres ,10);
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
      // message.destroy();
    }
    else{ 
      this.setState({activeTool: 'meten'  }); 
      this.setActiveTool( 'meten' );
      addMeasureLine(this.state.map, feat => {
            let geom = feat.getGeometry();
            this.messageBox(` Gemeten afstand: ${lineLength(geom)} m` ,0);
      });
    }
  }  

  measureArea = () => {
    if(this.state.activeTool == 'area'){ 
      this.setActiveTool('identify');
      removeMeasure(this.state.map);
      drawLayer.getSource().clear();
      // message.destroy();
    }
    else{ 
      this.setActiveTool('area');
      addMeasureArea(this.state.map, feat => {
            let geom = feat.getGeometry();
            this.messageBox(` Gemeten oppervlakte: ${polygonArea(geom)} m²` , 0);
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
    this.messageBox(<>De <a target='_blank' href={document.location.href} >Link</a> naar de kaart werd naar het klembord gestuurd<br/> </>, 5);
  }

  render() {
    
    let legendeCaption = i => <>   
                      <span style={{right:5, top: 5, position: 'absolute'}}>
                           <Slider style={{display: 'inline-block', width: 180}}  min={-100} max={0} defaultValue={-100}
                                   tooltip={{'formatter': val => `transparantie ${100 +val}%`}}
                                   onAfterChange={o => this.setVectorTrans(i, o/-100)}/> 
                      </span>
                    </>

    let adresBar = <AutoComplete  style={{padding:10, width: 240, height: 60 }}  
                      onChange={this.adresSearchChange} 
                      onSelect={this.adresSearchSelect}
                      onKeyDown={e =>{ if(e.key === 'Enter') this.adresSearchSelect(); } } 
                      notFoundContent="Geen adressen gevonden"
                      options={this.state.adressuggestions} 
                      placeholder="Zoek een Adres" 
                      allowClear={true} />
    let adresNode = adresBar;
    let toolBar = <div id='toolbar' >  
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

    let menuItems = [
    {
      key: 'layers',
      label: 'Lagen',
      icon: <FiLayers />,
      children: this.state.vectors.map((o, i) => ({
        key: o.id,
        disabled: true,
        style: { cursor: "pointer" },
        label: (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Checkbox 
              className="vectorChk"
              onChange={() => this.toggleVector(i)} 
              checked={this.state.vectors[i].lyr.getVisible()}
            >
              {o.name}
            </Checkbox>
            <Popover 
              title={legendeCaption(i)}
              zIndex={9999} 
              placement="bottomLeft" 
              color="#8d85cfdd"
              content={VectorLegendSVG(o.styleCache, 500)}
            >
              <FaList />
            </Popover>
          </div>
        ),
      })),
    },
    {
      key: 'histomap',
      label: 'Historische kaarten',
      icon: <FiCalendar />,
      children: [
        {
          key: 'transparencySlider',
          disabled: true,
          style: { cursor: "pointer" },
          label: (
            <Slider 
              tooltip={{ formatter: val => `transparantie ${100 + val}%` }}
              defaultValue={histo.getOpacity() * -100} 
              min={-100} max={0} step={1} 
              onChangeComplete={o => (histo.setOpacity(o / -100) || viewer.changed())} 
            />
          ),
        },
        ...this.state.histomaps.map(o => ({
          key: o.id,
          label: o.name,
        })),
      ],
    },
    {
      key: 'background',
      label: 'Achtergrond kaarten',
      icon: <FaMap />,
      children: this.state.basemaps.map(o => ({
        key: o.id,
        label: o.name,
      })),
    }
  ];


{/* change in Popover on collapse */}
    if(this.state.menuCollapse){
      adresNode = <> <Popover  color={'#002140'} placement="left" content={adresBar}> 
                      <div style={{paddingTop: '20px', paddingLeft: '30px' }} ><FaSearch /></div> 
                  </Popover>
                  <Divider  style={{ margin: '4px 0', borderColor: '#555' }} /> </>

    }
{/* render legende */}
    return (
          <Sider collapsible collapsed={this.state.menuCollapse} theme="dark"
                 onCollapse={c => this.setState({menuCollapse:c})}
                 style={{height:"100vh", overflowY:'auto', overflowX: 'hidden'}}
                 width={240} className="site-layout-background">
                <div style={{ paddingTop: 15, display: this.intialParams.logo ? "flex" : 'none', justifyContent: 'center', width: '100%' }} >
					<img src={logo} id="Logo" style={{ width: this.state.menuCollapse ? 40 : 120 }} />
				</div> 

              {adresNode}
              {toolBar}
          <Divider  style={{ margin: '4px 0', borderColor: '#555' }} />
          <Menu 
            mode="inline" 
            inlineIndent={10} 
            theme="dark"
            items={menuItems} 
            defaultOpenKeys={this.state.menuCollapse ? [] : ['layers']}
            selectedKeys={[this.state.basemap, this.state.histomap]} 
            onClick={(info) => {
              if (this.state.basemaps.find(m => m.id === info.key)) {
                this.activateBasemap(info.key);
              } else if (this.state.histomaps.find(m => m.id === info.key)) {
                this.activateHistomap(info.key);
              }
            }}
          />
          </Sider> )
    }
}
export default (props) => {
    // This hook safely grabs the message context from the <App> wrapper
    const { message } = App.useApp(); 
    
    // We pass it into your class component as a prop
    return <Legend {...props} antdMessage={message} />;
}