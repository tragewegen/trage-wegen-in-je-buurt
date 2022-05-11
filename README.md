# Trage wegen in Kaart

## Goal
Create reusable openlayers mapping application for use by Trage Wegen VZW. 

## Dependenies
	
We use nodejs/npm to install and manage dependenies: <https://nodejs.org> 

We use the following pakages: 	
- React framework: <https://reactjs.org>
- Packaging: <https://parceljs.org>
- UI: <https://reach.tech>  of https://ant.design/  ??
- Sidebar: <https://www.npmjs.com/package/react-pro-sidebar>
- Kaart: <https://openlayers.org> 

They are declared in the `package.json` and can be installed wit npm. 

For the location search we will the geopunt location service from the Flemish goverment 

<https://loc.geopunt.be/>

## Installation

Git and nodejs need te be installed. 

```
git clone https://github.com/warrieka/tw-openlayers-viewer
cd /tw-openlayers-viewer
npm install
```

To start the development server: 

```
npm run start
```
The server will run on url: <>


## Modify

To change the layers configuration:

In the folder src: 
- For the vectorlayers: [vectorLayers.js](src/vectorLayers.js) , see [VectorLayer](https://openlayers.org/en/latest/apidoc/module-ol_layer_Vector-VectorLayer.html) and [Example](https://openlayers.org/en/latest/examples/vector-layer.html)
- For the basemaps: [baseLayers.js](src/baseLayers.js) , see [XYZ](https://openlayers.org/en/latest/apidoc/module-ol_source_XYZ-XYZ.html) , [WMTS](https://openlayers.org/en/latest/apidoc/module-ol_source_WMTS-WMTS.html) and [XYZ](https://openlayers.org/en/latest/apidoc/module-ol_source_XYZ-XYZ.html) , [WMS](https://openlayers.org/en/latest/apidoc/module-ol_source_TileWMS-TileWMS.html)

See Openlayers documentation about how to modify these parameters : <https://openlayers.org/>

## Deploy

To make a production build and deploy: 

The deploy to github you need to be a collaborator on this project. 

```
npm run build
git commit --all -m "some commit message"
git push 
```

You can put all the contents of the [docs](docs)-folder on any webserver an it should work.
There are no serverside dependencies for production. 
