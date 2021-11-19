import "./style.css";
import { Map, View } from "ol";
import getWMTSLayer from "./wmts";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM.js";
import getWMSLayer from "./wms";
import getWFSLayer from "./wfs";
import initPopover from "./popover";
import projection from "./projection";
import initInteractions from "./interactions";

const mastermapWMTS = await getWMTSLayer("os_licensed_background_colour");
const woodlandWMS = getWMSLayer("sf_nwss");
const scenicAreasWFS = getWFSLayer("scot_gov:sg_national_scenic_areas")

const openStreetMap = new TileLayer({
  source: new OSM(),
});

const map = new Map({
  target: "map",
  layers: [
    // openStreetMap,
    mastermapWMTS,
    // woodlandWMS,
    scenicAreasWFS,
  ],
  view: new View({
    projection: projection,
    center: [279731, 693249],
    zoom: 6,
  }),
});

// initPopover(map, woodlandWMS);
initInteractions(map);