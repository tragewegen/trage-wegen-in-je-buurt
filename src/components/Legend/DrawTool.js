import Draw from 'ol/interaction/Draw';
import { drawLayer } from '../Map/initMap';


let draw;
let baseMeasure = (map, callback, type, timeOut=0) => {
   removeMeasure(map);

   draw = new Draw({
      source: drawLayer.getSource(),
      type: type
    });

   draw.addEventListener("drawend", e=>{
      if(timeOut > 0 ){
         setTimeout(() => drawLayer.getSource().clear(), timeOut*1000 );
      }
      callback(e.feature);
   })
   map.addInteraction(draw);

   return draw;
}


let addMeasureLine = (map, callback, timeOut) => baseMeasure(map, callback, "LineString", timeOut);
let addMeasureArea = (map, callback, timeOut) => baseMeasure(map, callback, "Polygon", timeOut);
let removeMeasure = map => map.removeInteraction(draw);

export {baseMeasure, addMeasureLine, addMeasureArea, removeMeasure}