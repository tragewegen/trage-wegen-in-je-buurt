// Configure the foreground vector layers
import {bbox, all} from 'ol/loadingstrategy';
import VectorSource from 'ol/source/Vector';
import GML3 from 'ol/format/GML3';
import GeoJSON from 'ol/format/GeoJSON';
import {Stroke, Fill, Icon, Text, Style} from 'ol/style';
import greenRoad from './images/greenRoad_lim.svg'

//#region TRAGE_WEGEN
//Trage wegen
///info: https://geoservices.vlaamsbrabant.be/TrageWegen/MapServer/WFSServer?service=wfs&request=GetCapabilities&version=1.1.0
const tragewegen_wfs = new VectorSource({
    format: new GML3(), // GML because ESRI does noet support GeoJSON
    url: function (extent) {
      let typeName = 'dataservices_TrageWegen:Trage_wegen';
      let outputFormat = "GML3";
      let uri = "https://geoservices.vlaamsbrabant.be/TrageWegen/MapServer/WFSServer?" + 
      `service=wfs&version=2.0.0&request=GetFeature&typeName=${typeName}&outputFormat=${outputFormat}&srsname=EPSG:3857&`+
      `bbox=${extent.join(',')},EPSG:3857`;
      return uri;
    },
    strategy: bbox,
  });
 
//styling functie voor trage wegen
function tragewegen_stl(feature, resolution) {
  let TW_JUR_STATUUT = feature.get('TW_JUR_STATUUT');
  let TW_TOEGANKELIJK = feature.get("TW_TOEGANKELIJK");
  let TW_ZICHTBAAR = feature.get("TW_TOEGANKELIJK");

  if ((TW_JUR_STATUUT == 2 && TW_TOEGANKELIJK == 1 && TW_ZICHTBAAR == -8) ||
    (TW_JUR_STATUUT == 2 && TW_TOEGANKELIJK == 1 && TW_ZICHTBAAR == 1)) {
    return tragewegen_cache.find(e => (e.id == "greenline")).style;
  }
  if (TW_JUR_STATUUT == 2 && TW_TOEGANKELIJK == 1 && TW_ZICHTBAAR == 2) {
    return tragewegen_cache.find(e => (e.id == "greenDot")).style;
  }
  if (TW_JUR_STATUUT == 2 && TW_TOEGANKELIJK == 2) {
    return tragewegen_cache.find(e => (e.id == "greenDash")).style;
  }
  if ((TW_JUR_STATUUT != 2 && TW_TOEGANKELIJK == 1 && TW_ZICHTBAAR == -8) ||
    (TW_JUR_STATUUT != 2 && TW_TOEGANKELIJK == 1 && TW_ZICHTBAAR == 1)) {
    return tragewegen_cache.find(e => (e.id == "blueline")).style;
  }
  if (TW_JUR_STATUUT != 2 && TW_TOEGANKELIJK == 1 && TW_ZICHTBAAR == 2) {
    return tragewegen_cache.find(e => (e.id == "blueDot")).style;
  }
  if (TW_JUR_STATUUT != 2 && TW_TOEGANKELIJK == 2) {
    return tragewegen_cache.find(e => (e.id == "blueDash")).style;
  }
  else {
    return tragewegen_cache.find(e => (e.id == "grayLine")).style;
  }
}

//styling cache voor trage wegen
const tragewegen_cache = [
 {
  id: "greenline",
  name: "Rooilijn in Atlas der Buurtwegen - toegankelijk",
  style: new Style({
    stroke: new Stroke({
      color: '#12db2a',
      width: 2
    })
  })
 }, {
    id: "greenDash",
    name: "Rooilijn in Atlas der Buurtwegen - ontoegankelijk",
    style: new Style({
      stroke: new Stroke({
        color: '#12db2a',
        width: 2,
        lineDash: [4,8],
        lineDashOffset: 6
      })
  })
}, {
  id: 'greenDot',
  name: "Rooilijn in Atlas der Buurtwegen, toegankelijk, maar niet zichtbaar op terrein",
  style: new Style({
    stroke: new Stroke({
      color: '#12db2a',
      width: 2,
      lineDash: [2,2],
      lineDashOffset: 2
    })
  })
}, {
  id: 'blueline',
  name: "Andere - toegankelijk",
  style: new Style({
    stroke: new Stroke({
    color:  '#1262db',
    width: 2
    })
  })
}, {
  id: 'blueDash',
  name: "Andere - ontoegankelijk",
  style: new Style({
    stroke: new Stroke({
      color:  '#1262db',
      width: 2,
      lineDash: [4,8],
      lineDashOffset: 6
    })
  }),
}, {
  id: 'blueDot',
  name: "Andere - toegankelijk, maar niet zichtbaar op terrein",
  style : new Style({
    stroke: new Stroke({
      color:  '#1262db',
      width: 2,
      lineDash: [2,2],
      lineDashOffset: 2
    })
  })
}, {
  id: 'grayLine',
  name: "Andere lagen",
  style : new Style({
    stroke: new Stroke({
      color:  '#808080',
      width: 2
    })
  })
}]
//#endregion

//#region PROVINCIES
///info: https://geoservices.informatievlaanderen.be/overdrachtdiensten/VRBG/wfs?REQUEST=GetCapabilities&SERVICE=WFS
const prov_wfs = new VectorSource({
  format: new GeoJSON(), // GML because ESRI does noet support GeoJSON
  url: function () {
    let typeName = 'VRBG:Refprv';
    let outputFormat = "json";
    let uri = "https://geoservices.informatievlaanderen.be/overdrachtdiensten/VRBG/wfs?" + 
    `service=wfs&version=2.0.0&request=GetFeature&typeName=${typeName}&outputFormat=${outputFormat}&srsname=EPSG:3857&count=50`;
    return uri;
  },
  strategy: all,
});
///styling 
let prov_stl = (feature, res) => {
  let stl = prov_cache[0].style
  stl.getText().setText(feature.get('NAAM'));
  stl.getText().setScale(res < 300 ? 1.5 : 1);
  return stl;
}

const prov_cache = [ {
  id: 'okerPolygon',
  name: "Provinciegrenzen", 
  style : new Style({
    text: new Text({
      font:'normal 10px sans-serif',
      fill: new Fill({
        color: 'rgba(100,100,0,1)',
      }),
    }),
    fill: new Fill({
      color: 'rgba(244,217,165,0.3)'
    }),
    stroke: new Stroke({
      color: 'rgba(240,240,0,1)', width: 2
    })
  })
}]
//#endregion

//#region OOSTVLAANDEREN
// Wijzigingen Oost-Vlaanderen 
///info: https://geodiensten.oost-vlaanderen.be/arcgis/services/MOB/OVL_buurtwegen_en_wijzigingen/MapServer/WFSServer?service=wfs&request=GetCapabilities&version=1.1.0
const tw_wijz_OVL_wfs = new VectorSource({
  format: new GML3(), // GML because ESRI does noet support GeoJSON
  url: function (extent) {
    let typeName = 'OVL_buurtwegen_en_wijzigingen:wijzigingen';
    let outputFormat = "GML3";
    let uri = "https://geodiensten.oost-vlaanderen.be/arcgis/services/MOB/OVL_buurtwegen_en_wijzigingen/MapServer/WFSServer?" + 
    `service=wfs&version=2.0.0&request=GetFeature&typeName=${typeName}&outputFormat=${outputFormat}&srsname=EPSG:3857&`+
    `bbox=${extent.join(',')},EPSG:3857`;
    return uri;
  },
  strategy: bbox,
});

///styling Wijzigingen Oost Vlaanderen
const tw_wijz_OVL_stl = new Style({
  stroke: new Stroke({
    color: '#138732', width: 2
  })
})
const tw_wijz_OVL_cache = [ {
  id: 'darkgreenline',
  name: "Wijzigingen Atlas Buurtwegen Oost-Vlaanderen", 
  style : tw_wijz_OVL_stl
}]
///popup-template Wijzigingen Oost Vlaanderen
const tw_wijz_OVL_tmpl = feat => `
<b>detailplanNr:${feat.detailplanNr}</b>
<ul>
<li>gemeentenr: ${feat.gemeentenr}</li>
<li>ID: ${feat.IDwijziging}</li>
<li>Datum:  ${feat.datum}</li>
<li>Scan: <a target="_blank" href="${feat.scan}">${feat.scan}</a></li>
</ul>`
//#endregion

//#region VLAAMSBRABANT
// Wijzigingen Vlaams-Brabant	
///info: https://geoservices.vlaamsbrabant.be/AtlasBuurtwegen_wijzigingen/MapServer/WFSServer?service=wfs&request=GetCapabilities&version=1.1.0
const tw_wijz_VLBr_wfs = new VectorSource({
  format: new GML3(), // GML because ESRI does noet support GeoJSON
  url: function (extent) {
    let typeName = 'dataservices_AtlasBuurtwegen_wijzigingen:Buurtwegwijzigingen';
    let outputFormat = "GML3";
    let uri = "https://geoservices.vlaamsbrabant.be/AtlasBuurtwegen_wijzigingen/MapServer/WFSServer?" + 
    `service=wfs&version=2.0.0&request=GetFeature&typeName=${typeName}&outputFormat=${outputFormat}&srsname=EPSG:3857&`+
    `bbox=${extent.join(',')},EPSG:3857`;
    return uri;
  },
  strategy: bbox,
});

///styling Wijzigingen Vlaams-Brabant
const tw_wijz_VLBr_stl = new Style({
  stroke: new Stroke({
    color: '#a83232', width: 2
  })
})
const tw_wijz_VLBr_cache = [ {
  id: 'redline',
  name: "Wijzigingen Atlas Buurtwegen Vlaams-Brabant", 
  style : tw_wijz_VLBr_stl
}]
///popup-template Wijzigingen Vlaams-Brabant
const tw_wijz_VLBr_tmpl = feat => `
<b>ID: ${feat.DocumentID} </b> 
<ul>
<li>Scan: <a href="${feat.rasterbeeld}" target="_blank" >
${feat.rasterbeeld}
</a></li>
<li>Omschrijving: ${feat.Omschrijving}</li> 
<li>Datum:  ${(new Date( Date.parse(feat.DATUM))).toLocaleDateString(
    'nl-be', { weekday:"long", year:"numeric", month:"long", day:"numeric"}) }</li>
</ul>`
//#endregion

//#region WESTVLAANDEREN
/// Wijzigingen_West-Vlaanderen
///info: https://wms.qgiscloud.com/tragewegen/trage_wegen_in_je_buurt?request=GetCapabilities&version=1.1.0&service=WFS 
const tw_wijz_WVL_wfs = new VectorSource({
  format: new GeoJSON({
              defaultDataProjection: 'EPSG:4326',
              featureProjection: 'EPSG:3857'
          }), // GeoJSON because QGIS-server
  url: function (extent) {
    let typeName = 'Wijzigingen_West-Vlaanderen';
    let outputFormat = "geojson";
    let uri = "https://wms.qgiscloud.com/tragewegen/trage_wegen_in_je_buurt?" + 
    `service=WFS&version=1.1.0&request=GetFeature&typeName=${typeName}&outputFormat=${outputFormat}&srsName=EPSG:4326&`+
    `bbox=${extent.join(',')},EPSG:3857`;
    return uri;
  },
  strategy: bbox,
});
///styling 
const tw_wijz_WVL_stl = new Style({
  stroke: new Stroke({
    color: '#34cceb', width: 2
  })
})
const tw_wijz_WVL_cache = [ {
  id: 'seablue',
  name: "Wijzigingen Atlas Buurtwegen West-Vlaanderen", 
  style : tw_wijz_WVL_stl
}]
//#endregion

//#region LIMBURG
/// Wijzigingen_Limburg
///info: https://wms.qgiscloud.com/tragewegen/trage_wegen_in_je_buurt?request=GetCapabilities&version=1.1.0&service=WFS 
const tw_wijz_LIM_wfs_punt = new VectorSource({
  format: new GeoJSON({
              defaultDataProjection: 'EPSG:4326',
              featureProjection: 'EPSG:3857'
          }), // GeoJSON because QGIS-server
  url: function (extent) {
    let typeName = 'Wijzigingen_Limburg_(punten)';
    let outputFormat = "geojson";
    let uri = "https://wms.qgiscloud.com/tragewegen/trage_wegen_in_je_buurt?" + 
    `service=WFS&version=1.1.0&request=GetFeature&typeName=${typeName}&outputFormat=${outputFormat}&srsName=EPSG:4326&`+
    `bbox=${extent.join(',')},EPSG:3857`;
    return uri;
  },
  strategy: bbox,
});
const tw_wijz_LIM_wfs_lijn = new VectorSource({
  format: new GeoJSON({
              defaultDataProjection: 'EPSG:4326',
              featureProjection: 'EPSG:3857'
          }), // GeoJSON because QGIS-server
  url: function (extent) {
    let typeName = 'Wijzigingen_Limburg_(lijnen)';
    let outputFormat = "geojson";
    let uri = "https://wms.qgiscloud.com/tragewegen/trage_wegen_in_je_buurt?" + 
    `service=WFS&version=1.1.0&request=GetFeature&typeName=${typeName}&outputFormat=${outputFormat}&srsName=EPSG:4326&`+
    `bbox=${extent.join(',')},EPSG:3857`;
    return uri;
  },
  strategy: bbox,
});
///styling 
const tw_wijz_LIM_stl_pt = new Style({
  image: new Icon({
    src: greenRoad, 
    anchor: [0.5, 0], anchorOrigin: 'bottom-left', //icon centered horizontaly and starting at bottom
    scale	: 0.33
  })
})
const tw_wijz_LIM_stl_lijn = new Style({
  stroke: new Stroke({
    color: '#733900', width: 2
  })
})
const tw_wijz_LIM_cache_1 = [ {
  id: 'greenRoad',
  name: "Wijzigingen Atlas Buurtwegen Limburg (punt)", 
  style : tw_wijz_LIM_stl_pt
}]
const tw_wijz_LIM_cache_2 = [ {
  id: 'brownline',
  name: "Wijzigingen Atlas Buurtwegen Limburg (lijn)", 
  style : tw_wijz_LIM_stl_lijn
}]
//#endregion

//#region ANTWERPEN
// Wijzigingen_Antwerpen
///info: https://wms.qgiscloud.com/tragewegen/trage_wegen_in_je_buurt?request=GetCapabilities&version=1.1.0&service=WFS 
const tw_wijz_ANT_wfs = new VectorSource({
  format: new GeoJSON({
              defaultDataProjection: 'EPSG:4326',
              featureProjection: 'EPSG:3857'
          }), // GeoJSON because QGIS-server
  url: function (extent) {
    let typeName = 'Wijzigingen_Antwerpen';
    let outputFormat = "geojson";
    let uri = "https://wms.qgiscloud.com/tragewegen/trage_wegen_in_je_buurt?" + 
    `service=WFS&version=1.1.0&request=GetFeature&typeName=${typeName}&outputFormat=${outputFormat}&srsName=EPSG:4326&`+
    `bbox=${extent.join(',')},EPSG:3857`;
    return uri;
  },
  strategy: bbox,
});
///styling 
const tw_wijz_ANT_stl = new Style({
  stroke: new Stroke({
    color: '#F18A00', width: 2
  })
})
const tw_wijz_ANT_cache = [ {
  id: 'darkredline',
  name: "Wijzigingen Atlas Buurtwegen Antwerpen", 
  style : tw_wijz_ANT_stl
}]
//#endregion

// LIJST 
const vectorsources = [ 
  {id:"trw", source: tragewegen_wfs, name: "Trage wegen", visible: true, 
        style: tragewegen_stl,   styleCache: tragewegen_cache,   minZ: 12 } ,
  // {id:"prov", source: prov_wfs, name: "Provinciegrenzen",  visible: false, 
  //       style: prov_stl, styleCache: prov_cache, minZ: 5 } ,
  {id:"tw_wijz_VLBr", source: tw_wijz_VLBr_wfs, name: "Wijz. Vlaams-Brabant",  visible: false, 
        style: tw_wijz_VLBr_stl, styleCache: tw_wijz_VLBr_cache, minZ: 12 , template: tw_wijz_VLBr_tmpl } ,
  {id:"tw_wijz_OVL",  source: tw_wijz_OVL_wfs,  name: "Wijz. Oost-Vlaanderen", visible: false, 
        style: tw_wijz_OVL_stl,  styleCache: tw_wijz_OVL_cache, minZ: 12 , template: tw_wijz_OVL_tmpl } ,
  {id:"tw_wijz_WVL",  source: tw_wijz_WVL_wfs , name: "Wijz. West-Vlaanderen", visible: false, 
        style: tw_wijz_WVL_stl,  styleCache: tw_wijz_WVL_cache, minZ: 12  } ,
  {id:"tw_wijz_ANT",  source: tw_wijz_ANT_wfs,  name: "Wijz. Antwerpen", visible: false, 
        style: tw_wijz_ANT_stl,  styleCache: tw_wijz_ANT_cache, minZ: 12  } ,
  {id:"tw_wijz_LIM_ln",  source: tw_wijz_LIM_wfs_lijn,  name: "Wijz. Limburg (lijn)", visible: false, 
        style: tw_wijz_LIM_stl_lijn,  styleCache: tw_wijz_LIM_cache_2, minZ: 12  } ,
  {id:"tw_wijz_LIM_pt",  source: tw_wijz_LIM_wfs_punt,  name: "Wijz. Limburg (punt)", visible: false, 
        style: tw_wijz_LIM_stl_pt,  styleCache: tw_wijz_LIM_cache_1, minZ: 12  } 
  ];

export {vectorsources};
export default vectorsources;