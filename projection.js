import proj4 from "proj4";
import Projection from "ol/proj/Projection";
import { register } from "ol/proj/proj4";
import { addEquivalentProjections } from 'ol/proj';

// Define British National Grid Proj4js projection
proj4.defs(
  "EPSG:27700",
  "+proj=tmerc +lat_0=49 +lon_0=-2 +k=0.9996012717 +x_0=400000 +y_0=-100000 +ellps=airy +towgs84=446.448,-125.157,542.06,0.15,0.247,0.842,-20.489 +units=m +no_defs"
);
// Register this with OpenLayers
register(proj4);

// Create a new Projection for BNG, with UK extents
const projectionBNG = new Projection({
  extent: [0, 0, 700000, 1300000],
  units: "m",
  code: "EPSG:27700",
});

// Create a new Projection for BNG, with UK extents
// Note: This will later be used to Fetch WFS features
const projectionGML = new Projection({
  extent: [0, 0, 700000, 1300000],
  units: "m",
  code: "http://www.opengis.net/gml/srs/epsg.xml#27700",
});

// Ensure that when calling WFS, OpeLayers understands that "EPSG:27700" and "http://www.opengis.net/gml/srs/epsg.xml#27700" are equivalent 
addEquivalentProjections([projectionGML, projectionBNG]);

export default projectionBNG;