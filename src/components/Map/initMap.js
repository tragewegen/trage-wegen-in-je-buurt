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
<<<<<<< HEAD
import {urlParams} from '../tools'
=======
import {urlParams} from '../tools';
>>>>>>> a6d60d05481360b548d1367f2d665af1e6390904

const params = urlParams();
let baseMap = baselayers.find(e=> (e.id === params.basemap)) ;
let histoMap = histolayers.find(e=> (e.id === params.histomap)) ;
 
//initial background
const background = new TileLayer({
    title: 'Achtergrond',
    source: baseMap ? baseMap.source : null
   });

const histo = new TileLayer({
    title: 'Historische kaart',
    opacity:  params.histTrans,
    source: histoMap ? histoMap.source : null
   });

<<<<<<< HEAD

=======
>>>>>>> a6d60d05481360b548d1367f2d665af1e6390904
//initial View 
const viewer = new View({
        center: [414243,6627955],
        zoom: 13, maxZoom: 21, minZoom: 7,
        extent: [177852,6078083,968831,6920858] 
<<<<<<< HEAD
    });

 const drawLayer = new VectorLayer({
=======
   });

const drawLayer = new VectorLayer({
>>>>>>> a6d60d05481360b548d1367f2d665af1e6390904
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
<<<<<<< HEAD
  });

// create an Overlay using the div with id location.
let marker = new Overlay({
  stopEvent: false
});
=======
   });

// create Overlays using the div with id location (set in Map)
let marker = new Overlay({stopEvent: false, positioning: 'bottom-center'});
let crossHair = new Overlay({ stopEvent: false, positioning: 'center-center'});

>>>>>>> a6d60d05481360b548d1367f2d665af1e6390904
// create a Geolocation object setup to track the position of the device
let geolocation = new Geolocation({
        tracking: false, 
        projection: viewer.getProjection()
      });
geolocation.on('change:position',  () => {
        const coordinates = geolocation.getPosition(); 
<<<<<<< HEAD
        marker.setPosition(coordinates);
=======
        crossHair.setPosition(coordinates);
>>>>>>> a6d60d05481360b548d1367f2d665af1e6390904
 });


const initMap = () => {
    let map = new Map({
        interactions: defaultInteractions().extend([new DragRotateAndZoom()]),
        layers: [background, histo, drawLayer],
        view: viewer
    });
    map.addControl(new ScaleLine());
<<<<<<< HEAD
    map.addOverlay(marker);
    return map;
}

export {initMap, background, histo, viewer, drawLayer, marker, geolocation};
=======
    map.addOverlay(crossHair);
    if(params.marker){
      map.addOverlay(marker);
      marker.setPosition(params.marker)
    }
    return map;
}

export {initMap, background, histo, viewer, drawLayer, marker, crossHair, geolocation};
>>>>>>> a6d60d05481360b548d1367f2d665af1e6390904
