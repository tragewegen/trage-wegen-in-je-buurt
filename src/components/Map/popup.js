
import {drawLayer} from './initMap'
import Feature from 'ol/Feature';
import vectorLayers from '../../vectorLayers';

class popup{
  constructor(map, callback, tool='identify'){
    this.map = map;
    this.tool = tool;
    this.map.on('click', evt => {
      map.forEachFeatureAtPixel(evt.pixel, this.onFeature(callback), {hitTolerance: 6});
    });
  }

  onFeature(callback) {
    return (feature, layer) => {
      if (layer && this.tool == 'identify') {
        let title = layer.get("title") ;
        if ( !(title == "Achtergrond" || title == 'draw' || title == 'Provinciegrenzen') ) {
          let geom = feature.getGeometry();
          drawLayer.getSource().addFeature(new Feature({geometry: geom}));
          let attrs = '';
          let src = vectorLayers.find(e => e.name == title);
          if(src && src.template){
            attrs = src.template( feature.getProperties() );
          }
          else {
            feature.getKeys().forEach(k => {
              let v = feature.get(k);
              if (typeof v == 'object' || typeof v == 'undefined') return;
              let url = validUrl(v);
              if (url){
                attrs += `<b>${k}</b>: <a href="${url.href}" target="_blank" >${
                                  url.pathname.substring(url.pathname.lastIndexOf('/') + 1)}</a>  <br>`
              } 
              else {
                attrs += `<b>${k}</b>: ${v}<br>`
              }
            })
          }
          callback(title, attrs, geom);
        }
        return;
      }
    };
  }
}

function validUrl(string) {
  let url;
  try { url = new URL(string);}
  catch { return false; }
  if(url.protocol === "http:" || url.protocol === "https:"){
    return url;
  }
  return false;
}

export default popup;