// Configure the background tile-layers
// https://openlayers.org/en/latest/apidoc/
import XYZ from 'ol/source/XYZ';
import OSM from 'ol/source/OSM';
import WMTS from 'ol/source/WMTS';
import WMS from 'ol/source/TileWMS'
import WMTSTileGrid from 'ol/tilegrid/WMTS';
import {get as getProjection} from 'ol/proj';
import {getTopLeft, getWidth} from 'ol/extent';

//WMTS config: OSM-like tiling:
/// https://wiki.openstreetmap.org/wiki/Slippy_map_tilenames and https://wiki.openstreetmap.org/wiki/Zoom_levels 
const webMercator = getProjection('EPSG:3857');
const webmercatorExtent = webMercator.getExtent();
const size = getWidth(webmercatorExtent) / 256;
const resolutions = new Array(21);
const matrixIds = new Array(21);
for (let z = 0; z < 21; ++z) {
  resolutions[z] = size / Math.pow(2, z);
  matrixIds[z] = z;
}

// HISTORISCHE KAARTEN 
let ngi1873 =	new XYZ({
  //info: https://www.ngi.be/tiles/arcgis/rest/services/seamless_carto__default__3857__1300/MapServer
    url: "https://www.ngi.be/tiles/arcgis/rest/services/seamless_carto__default__3857__140/MapServer/tile/{z}/{y}/{x}",
    minZoom: 7 , maxZoom: 17,
    projection: webMercator, crossOrigin: 'anonymous',
    attributions: ["NGI: <a href='https://www.ngi.be/website/gebruiksvoorwaarden-cartoweb-be'>gebruiksvoorwaarden</a>"]
});
let ngi1904= new XYZ({
  //info: https://www.ngi.be/tiles/arcgis/rest/services/seamless_carto__default__3857__1300/MapServer
    url: "https://www.ngi.be/tiles/arcgis/rest/services/seamless_carto__default__3857__450/MapServer/tile/{z}/{y}/{x}",
    minZoom: 7 , maxZoom: 17,  
    projection: webMercator, crossOrigin: 'anonymous',
    attributions: ["NGI: <a href='https://www.ngi.be/website/gebruiksvoorwaarden-cartoweb-be'>gebruiksvoorwaarden</a>"]
});
let ngi1939 =	new XYZ({
    url: "https://www.ngi.be/tiles/arcgis/rest/services/seamless_carto__default__3857__800/MapServer/tile/{z}/{y}/{x}",
    minZoom: 7 , maxZoom: 17, 
    projection: webMercator,   crossOrigin: 'anonymous',
    attributions: ["NGI: <a href='https://www.ngi.be/website/gebruiksvoorwaarden-cartoweb-be'>gebruiksvoorwaarden</a>"]
});
let ngi1969= new XYZ({
  //info: https://www.ngi.be/tiles/arcgis/rest/services/seamless_carto__default__3857__1300/MapServer  
    url: "https://www.ngi.be/tiles/arcgis/rest/services/seamless_carto__default__3857__1100/MapServer/tile/{z}/{y}/{x}",
    minZoom: 7 , maxZoom: 17, 
    projection: webMercator, crossOrigin: 'anonymous',
    attributions: ["NGI: <a href='https://www.ngi.be/website/gebruiksvoorwaarden-cartoweb-be'>gebruiksvoorwaarden</a>"]
});
let ngi1981 =	new XYZ({
  //info: https://www.ngi.be/tiles/arcgis/rest/services/seamless_carto__default__3857__1300/MapServer
    url: "https://www.ngi.be/tiles/arcgis/rest/services/seamless_carto__default__3857__1220/MapServer/tile/{z}/{y}/{x}",
    minZoom: 7 , maxZoom: 17, 
    projection: webMercator, crossOrigin: 'anonymous',
    attributions: ["NGI: <a href='https://www.ngi.be/website/gebruiksvoorwaarden-cartoweb-be'>gebruiksvoorwaarden</a>"]
});
let ngi1989= new XYZ({
  //info: https://www.ngi.be/tiles/arcgis/rest/services/seamless_carto__default__3857__1300/MapServer
    url: "https://www.ngi.be/tiles/arcgis/rest/services/seamless_carto__default__3857__1300/MapServer/tile/{z}/{y}/{x}",
    minZoom: 7 , maxZoom: 17, 
    projection: webMercator,  crossOrigin: 'anonymous',
    attributions: ["NGI: <a href='https://www.ngi.be/website/gebruiksvoorwaarden-cartoweb-be'>gebruiksvoorwaarden</a>"]
});

let ngiwms =  new WMS({
  //info: https://wms.ngi.be/inspire/topomaps/service?version=1.3.0&service=wms&&request=GetCapabilities
  url: 'https://wms.ngi.be/inspire/topomaps/service',
  params: {'LAYERS': 'top25map'},
  serverType: 'geoserver',
  attributions: ["NGI: <a href='https://www.ngi.be/website/gebruiksvoorwaarden-cartoweb-be'>gebruiksvoorwaarden</a>"]
});

let nginow = new XYZ({
  //info: https://cartoweb.wmts.ngi.be/1.0.0/WMTSCapabilities.xml
    url: "https://cartoweb.wmts.ngi.be/1.0.0/topo/default/3857/{z}/{y}/{x}.png",
    minZoom: 7 , maxZoom: 17, 
    projection: webMercator,  crossOrigin: 'anonymous',
    attributions: ["NGI: <a href='https://www.ngi.be/website/gebruiksvoorwaarden-cartoweb-be'>gebruiksvoorwaarden</a>"]
});

let abw = new WMTS({
  //info: https://geo.api.vlaanderen.be/HISTCART/wmts?request=getcapabilities&service=wmts&version=1.0.0 
    url: 'https://geo.api.vlaanderen.be/HISTCART/wmts',
    attributions: ["Vlaamse provincies, Geen beperkingen op de publieke toegang"],  
    crossOrigin: 'anonymous',
    layer: 'abw',
    matrixSet: 'GoogleMapsVL',
    format: 'image/png',
    projection: webMercator,
    tileGrid: new WMTSTileGrid({
        origin: getTopLeft(webmercatorExtent),
        resolutions: resolutions, matrixIds: matrixIds }),
    style: '',
    wrapX: true,webmercatorExtent
});

// BASISKAARTEN
let tw_Mapbox = new XYZ({  //NOT USED
  //info: https://api.mapbox.com/styles/v1/tragewegenantwerpen/ckgtudjm12i7819pfgynlwr07/wmts?access_token=pk.eyJ1IjoidHJhZ2V3ZWdlbmFudHdlcnBlbiIsImEiOiJjanNidDBhMzgwMmNjNGFwZmZnemFydXZnIn0.wbWyb0tpUuCfIvzF2KuPKQ
    url: "https://api.mapbox.com/styles/v1/tragewegenantwerpen/ckgtudjm12i7819pfgynlwr07/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoidHJhZ2V3ZWdlbmFudHdlcnBlbiIsImEiOiJjanNidDBhMzgwMmNjNGFwZmZnemFydXZnIn0.wbWyb0tpUuCfIvzF2KuPKQ",
    minZoom: 0 , maxZoom: 22, projection: webMercator, attributions: ["trage wegen vzw"], 
})
let osm = new OSM();

let lufo =  new WMTS({
  //info: https://tile.informatievlaanderen.be/ws/raadpleegdiensten/wmts?request=getcapabilities&service=wmts&version=1.0.0 
    url: 'https://geo.api.vlaanderen.be/OFW/wmts',
    attributions: ["Informatie Vlaanderen: <a href='https://overheid.vlaanderen.be/Webdiensten-Gebruiksrecht'>gebruiksvoorwaarden</a>"], 
    crossOrigin: 'anonymous',
    layer: 'ofw',
    matrixSet: 'GoogleMapsVL',
    format: 'image/png',
    projection: webMercator,
    tileGrid: new WMTSTileGrid({
      origin: getTopLeft(webmercatorExtent),
      resolutions: resolutions,
      matrixIds: matrixIds,
      }),
    style: '',
    wrapX: true,
});

let grb =  new WMTS({
  //info: https://tile.informatievlaanderen.be/ws/raadpleegdiensten/wmts?request=getcapabilities&service=wmts&version=1.0.0 
    url: 'https://geo.api.vlaanderen.be/GRB/wmts',
    attributions: ["Informatie Vlaanderen: <a href='https://overheid.vlaanderen.be/Webdiensten-Gebruiksrecht'>gebruiksvoorwaarden</a>"], 
    crossOrigin: 'anonymous',
    layer: 'grb_bsk_grijs',
    matrixSet: 'GoogleMapsVL',
    format: 'image/png',
    projection: webMercator,
    tileGrid: new WMTSTileGrid({
      origin: getTopLeft(webmercatorExtent),
      resolutions: resolutions,
      matrixIds: matrixIds }),
    style: '',
    wrapX: true,
 });

// LIJST Achtergrondkaarten
const baselayers = [         
  {id:"nginow",  source: nginow , name: "Huidige NGI Basiskaart"},
  {id:"grb", source: grb, name: "Basiskaart Vlaanderen"},
  {id:"lufo", source: lufo, name: "Meest recente luchtfoto"},
  {id:"osm", source: osm,  name: "Openstreetmap" },
//  {id:'tw_Mapbox', source: tw_Mapbox, name: "Basiskaart Trage wegen"} 
];

// LIJST Historische kaarten
const histolayers = [
  {id:"abw", source: abw, name: "Atlas der Buurtwegen"},
  {id:"ngi1873", source: ngi1873, name: "NGI Basiskaart, 1873"},
  {id:"ngi1904", source: ngi1904, name: "NGI Basiskaart, 1904"},
  {id:"ngi1939", source: ngi1939, name: "NGI Basiskaart, 1939"},
  {id:"ngi1969", source: ngi1969, name: "NGI Basiskaart, 1969"},
  {id:"ngi1981", source: ngi1981, name: "NGI Basiskaart, 1981"},
  {id:"ngi1989", source: ngi1989, name: "NGI Basiskaart, 1989"},
  {id:"ngi2000", source: ngiwms, name: "NGI Basiskaart, 2000+"},
  {id:"", source: null, name: "Geen Historische kaart"},
 ];

export {baselayers, histolayers};
export default baselayers;
