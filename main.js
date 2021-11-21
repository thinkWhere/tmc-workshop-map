import "./style.css";
import { Map, View } from "ol";
import OSM from "ol/source/OSM.js";
import getWMTSLayer from "./wmts";
import projectionBNG from "./projection";
import TileLayer from "ol/layer/Tile";
import getWMSLayer from "./wms";
import initPopover from "./popover";
import getWFSLayer from "./wfs";
import initInteractions from "./interactions";
import initGazetteer from "./gazetteer";

// Create layer from imported functions
const mastermapWMTS = await getWMTSLayer("os_licensed_background_colour");
const woodlandWMS = getWMSLayer("sf_nwss");
const scenicAreasWFS = getWFSLayer("osmm:osmm_topographicarea")

// Set up a new Tile Layer
const openStreetMap = new TileLayer({
  // OL has a number of built in sources, such as Stamen, OpenStreetMap, and BingMaps
  source: new OSM(),
});

// Set up an instance of an OpenLayers map
const map = new Map({
  // This is the HTML element we will target to render our map
  target: "map",
  layers: [
    // openStreetMap,
    mastermapWMTS,
    woodlandWMS,
    // scenicAreasWFS,
  ],
  // A View object represents a simple 2D view of the map.
  // This is the object to act upon to change the center, resolution, and rotation of the map
  view: new View({
    // Apply imported British National Grid as the projection
    projection: projectionBNG,
    center: [279731, 693249],
    zoom: 6,
  }),
});

// Zoom to
function zoomTo(coord_string) {
  var split = coord_string.split(",");
  if(split.length == 2) {
    map.getView().setResolution(0.5);
    map.getView().setCenter([parseInt(split[0]), parseInt(split[1])]);
  }
}

initPopover(map, woodlandWMS);
// initInteractions(map);
// initGazetteer(zoomTo);
