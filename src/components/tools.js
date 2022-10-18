import {Vector as VectorLayer} from 'ol/layer';

import {fromLonLat, transformExtent, transform, get as getProj} from 'ol/proj';
import {register} from 'ol/proj/proj4';
import proj4 from 'proj4';

proj4.defs("EPSG:31370","+proj=lcc +lat_1=51.16666723333333 +lat_2=49.8333339 "+
    "+lat_0=90 +lon_0=4.367486666666666 +x_0=150000.013 +y_0=5400088.438 +ellps=intl "+
    "+towgs84=-106.869,52.2978,-103.724,0.3366,-0.457,1.8422,-1.2747 +units=m +no_defs");
register(proj4);
const wgs = getProj('EPSG:4326');
const lb72 = getProj('EPSG:31370');

const transformExtent_tolb72 = (extent, proj) => transformExtent(extent, proj, lb72);
const transformExtent_fromlb72 = (extent, proj) => transformExtent(extent, lb72, proj);
const latlon_tolb72 = xy => transform(xy , wgs, lb72);
const latlon_fromlb72 = xy => transform(xy, lb72, wgs);
const tolb72 = (xy, proj) => transform(xy , proj, lb72);
const fromlb72 = (xy, proj)  => transform(xy, lb72, proj);

const date_toTimeString = timeString => {
    let re = /(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+)|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d)|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d)/
    if (re.test(timeString) || typeof timeString === 'number' ){
        return (new Date( Date.parse(timeString))).toLocaleDateString(
            'nl-be', { weekday:"long", year:"numeric", month:"long", day:"numeric"})
    }
    else if(timeString instanceof Date){
        return timeString.toLocaleDateString(
            'nl-be', { weekday:"long", year:"numeric", month:"long", day:"numeric"})
    }
    else {
        return timeString
    }
}


const polygonArea = geom =>  {
    geom.transform('EPSG:3857', "EPSG:31370");
    let area = geom.getArea().toFixed(2);
    geom.transform( "EPSG:31370", 'EPSG:3857',);
    return area;
}

const lineLength = geom =>  {
    geom.transform('EPSG:3857', "EPSG:31370");
    let area = geom.getLength().toFixed(2);
    geom.transform( "EPSG:31370", 'EPSG:3857',);s
    return area;
}


const addVectorLayer = (map, dataSource, style, title, minZ=11, visible=true) => {
    let vector = new VectorLayer({
        title: title, visible: visible,
        source: dataSource, minZoom: minZ,
        style: style
        });
    map.addLayer(vector);
    return vector;
}

const urlParams = () => {
    const params = (new URL(document.location)).searchParams;
    const trues = ["true", "1", "yes", ''];
    const logo = params.get("logo") ? trues.includes( params.get("logo").toLowerCase() ) : true;
    const lyrs = params.get("lyrs") ? params.get("lyrs").split(',') : ['trw'];
    const base =  params.get("base") ? params.get("base") : 'osm';
    const histo =  params.get("histo") ? params.get("histo") : '';
    const histTrans =  params.get("histTrans") ? parseFloat( params.get("histTrans") ): 0.5;
    let x = parseFloat( params.get("x"));
    let y = parseFloat( params.get("y"));
    let z = params.get("z") ? parseInt( params.get("z")) : 13;
    let xy = [414243,6627955]; 
    if( x && y ) {
        xy = fromLonLat([x,y]); 
    }
    z= z ? z : 8; 
    return { center: xy, zoom: z, logo: logo, basemap: base, layers: lyrs , histomap: histo, histTrans: histTrans }
}


const VectorLegendSVG = (styleCache, viewBoxWidth) => {
    let step = 25;
    let viewBoxHeight = (styleCache.length * step) + 5;
    return (
      <svg width={viewBoxWidth} height={viewBoxHeight} viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}>
          {styleCache.map( (o,i) => {
             let stroke = o.style.getStroke();
             /// POLYGON
             let fill =  o.style.getFill();
             /// POINT, only icon is supported
             let icon =  o.style.getImage();
             /// Default legende icon
             let legendeIcon = <text fill='#002140' x="0" y={(i*step +30).toString()}>Style not supported</text>

             if(icon){
                let iconUrl = icon.toDataURL ? icon.toDataURL() : icon.getSrc ? icon.getSrc() : null;
                if(iconUrl != null) {
                    legendeIcon = <image 
                            href={iconUrl}  x="0" y={(i*step).toString()} height="20" width="20"/>
                }    
             }
             else if(fill){
                let fillColor = fill.getColor();
                let strokeColor = stroke.getColor();
                let width = stroke.getWidth().toString();
                legendeIcon = <rect   
                     x="2" y={(i*step +5 ).toString()} height="18" width="18"
                     fill={fillColor} stroke={strokeColor} strokeWidth={width} /> 
             }
             else if(stroke){
                let color = stroke.getColor();
                let width = stroke.getWidth().toString();
                let dash= stroke.getLineDash() ? stroke.getLineDash().join(' '): '';
                legendeIcon = <line x1='0' x2='20'
                                    y1={(i*step +0).toString()} 
                                    y2={(i*step +20).toString()} 
                                    stroke={color} strokeWidth={width} strokeDasharray={dash} /> 
             }
             return (
                <g key={o.id}  >
                  <text fill='#002140' x="23"  y={(i*step +20).toString()}>{o.name}</text>
                  {legendeIcon}
                </g> )
          } )}
      </svg>
    );
  };

export {addVectorLayer, urlParams, VectorLegendSVG, latlon_tolb72, latlon_fromlb72, tolb72, fromlb72, 
    polygonArea, lineLength, date_toTimeString, transformExtent_tolb72, transformExtent_fromlb72};