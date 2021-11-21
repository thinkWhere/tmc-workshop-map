import { bbox as bboxStrategy } from "ol/loadingstrategy";
import { WFS } from "ol/format";
import { Fill, Stroke, Style } from 'ol/style';
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";

// Helper function get a WFS layer from the MapCloud
// Note: The details required to make this request are returned by the CustomerService API
// https://api.themapcloud.com/api/v2/customer-services/details/{mapservice_id}
const getWFSLayer = (layerName) => {
  // Extract the featurePrefix and featureType from the full layer name
  const [featurePrefix, featureType] = layerName.split(":")
  // Create a new instance of the WFS class
  // This is a feature format for reading and writing data in the WFS format
  const formatWFS = new WFS();
  // Set up our Vector Source for the WFS layer
  const sourceWFS = new VectorSource({
    // Define our loader function which will fetch features from our service
    loader: (extent) => {
      // Create an encoded WFS GetFeature request
      const featureRequest = formatWFS.writeGetFeature({
        srsName: "EPSG:27700",
        featureNS: `http://thinkwhere.com/${featurePrefix}`,
        featurePrefix: featurePrefix,
        featureTypes: [featureType],
        bbox: extent,
        // Geometry name can be variable, but hardcoded for this function
        // See note above on how to get these details from tMC API
        geometryName: "polygon",
        maxFeatures: 1000,
      });
      // Make a POST request to the WFS API endpoint
      fetch(
        `https://api.themapcloud.com/maps/wfs?token=${
          import.meta.env.VITE_TMC_TOKEN
        }`,
        {
          method: "POST",
          // Serialise our GetFeature request as a string
          body: new XMLSerializer().serializeToString(featureRequest),
        }
      )
        .then((response) => response.text())
        .then((xml) => {
          // Parse response and convert XML (GML) to OpenLayers features
          // This is the step that requires the projectionGML object from earlier
          let features = formatWFS.readFeatures(xml, {
            dataProjection: "EPSG:27700",
            featureProjection: "EPSG:27700",
          });
          // Add our OL features to the source
          sourceWFS.addFeatures(features);
        });
    },
    // Define a loading stategy to use for fetching features
    // OL has a few built in, or a custom strategy can be created
    strategy: bboxStrategy,
  });

  // Define a style to apply to our layer
  const wfsStyle = new Style({
    stroke: new Stroke({
      color: 'rgba(0, 0, 255, 1.0)',
      width: 2,
    }),
    fill: new Fill({
      color: 'rgba(0, 0, 255, 0.3)'
    })
  });

  // Create a vector layer using our source and style
  const vectorLayer = new VectorLayer({
    source: sourceWFS,
    style: wfsStyle,
    // A scale threshold is set to limit the number of features returned in one go
    minZoom: 14,
  });

  return vectorLayer;
};

export default getWFSLayer;
