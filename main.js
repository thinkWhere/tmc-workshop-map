import "./style.css";
import { Map, View } from "ol";
import OSM from "ol/source/OSM.js";
import projectionBNG from "./projection";
import TileLayer from "ol/layer/Tile";
import getWMTSLayer from "./wmts";

// Create layer from imported functions
const mastermapWMTS = await getWMTSLayer("os_licensed_background_colour");

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