import {fromLonLat} from 'ol/proj';
import {register} from 'ol/proj/proj4';
import proj4 from 'proj4';
register(proj4);

const osm_URI = `https://nominatim.openstreetmap.org/search`;

export async function suggest_osm(q){
    let resp = await fetch( 
        `${osm_URI}?q=${encodeURIComponent(q)}&countrycodes=be&format=json` );
    let rjs = await resp.json();
    return rjs.map(e => ( {value: e.display_name, key: e.osm_id} ));
  }


export async function geocode_osm(q){

    let resp = await fetch( 
        `${osm_URI}?q=${encodeURIComponent(q)}&countrycodes=be&format=json` );
    rjs = await resp.json();

    if( rjs && rjs.length > 0){
      let loc = rjs[0];
      let xy = fromLonLat([parseFloat(loc.lon), parseFloat(loc.lat)]);
      let LowerLeft = fromLonLat([ parseFloat(loc.boundingbox[2]), parseFloat(loc.boundingbox[0]) ]);
      let UpperRight = fromLonLat([ parseFloat(loc.boundingbox[3]), parseFloat(loc.boundingbox[1]) ]);
      let bbox = [  LowerLeft[0] -50,  LowerLeft[1] -50,
                   UpperRight[0] +50, UpperRight[1] +50];
      let status = `https://www.openstreetmap.org/${loc.osm_type}/${loc.osm_id}`;

      return {
        xy: xy, status: status, adres: loc.display_name, bbox: bbox
      }    
    }    
    else return {
        xy: null, status: "adres niet gevonden", adres: null, bbox: null
      }
  }