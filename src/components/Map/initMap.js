import Map from 'ol/Map';
import TileLayer from 'ol/layer/Tile';
import View from 'ol/View';
import Geolocation from 'ol/Geolocation';
import Overlay from 'ol/Overlay';
import {baselayers, histolayers} from '../../baseLayers';
import {ScaleLine} from 'ol/control';
import {Vector as VectorSource} from 'ol/source';
import {Vector as VectorLayer} from 'ol/layer';
import {Circle, Fill, Stroke, Style} from 'ol/style';
import {
  DragRotateAndZoom,
  defaults as defaultInteractions,
} from 'ol/interaction';
import {urlParams} from '../tools'

const params = urlParams();
let baseMap = baselayers.find(e=> (e.id === params.basemap)) || histolayers.find(e=> (e.id === params.basemap)) ;

 
//initial background
const background = new TileLayer({
    title: 'Achtergrond',
    source: baseMap.source
   });

//initial View 
const viewer = new View({
        center: [414243,6627955],
        zoom: 13, maxZoom: 21, minZoom: 7,
        extent: [177852,6078083,968831,6920858] 
    });

 const drawLayer = new VectorLayer({
    title: 'draw',
    source: new VectorSource(),
    style: new Style({
        fill: new Fill({
          color: 'rgba(255, 255, 0, 0.5)'
        }),
        stroke: new Stroke({
          color: 'rgb(255, 255, 0)', width: 4
        }),
        image: new Circle({
            radius: 7,
            fill: new Fill({
              color: 'rgba(255, 255, 0, 0.5)',
            }), 
        })
      })
  });

// create an Overlay using the div with id location.
let marker = new Overlay({
  stopEvent: false
});
// create a Geolocation object setup to track the position of the device
let geolocation = new Geolocation({
        tracking: false, 
        projection: viewer.getProjection()
      });
geolocation.on('change:position',  () => {
        const coordinates = geolocation.getPosition(); 
        marker.setPosition(coordinates);
 });


const initMap = () => {
    let map = new Map({
        interactions: defaultInteractions().extend([new DragRotateAndZoom()]),
        layers: [background, drawLayer],
        view: viewer
    });
    map.addControl(new ScaleLine());
    map.addOverlay(marker);
    return map;
}

export {initMap, background, viewer, drawLayer, marker, geolocation};
