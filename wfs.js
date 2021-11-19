import { bbox as bboxStrategy } from "ol/loadingstrategy";
import { WFS } from "ol/format";
import { Fill, Stroke, Style } from 'ol/style';
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";

const getWFSLayer = (layerName) => {
  const [featurePrefix, featureType] = layerName.split(":")
  const formatWFS = new WFS();
  const sourceWFS = new VectorSource({
    loader: (extent) => {
      const featureRequest = formatWFS.writeGetFeature({
        srsName: "EPSG:27700",
        featureNS: `http://thinkwhere.com/${featurePrefix}`,
        featurePrefix: featurePrefix,
        featureTypes: [featureType],
        bbox: extent,
        // geometryName is variable, details can be accessed via the account-services API
        // link here!
        geometryName: "shape",
        maxFeatures: 1000,
      });
      fetch(
        `https://api.themapcloud.com/maps/wfs?token=${
          import.meta.env.VITE_TMC_TOKEN
        }`,
        {
          method: "POST",
          body: new XMLSerializer().serializeToString(featureRequest),
        }
      )
        .then((response) => response.text())
        .then((xml) => {
          let features = formatWFS.readFeatures(xml, {
            dataProjection: "EPSG:27700",
            featureProjection: "EPSG:27700",
          });
          sourceWFS.addFeatures(features);
        });
    },
    strategy: bboxStrategy,
  });

  const wfsStyle = new Style({
    stroke: new Stroke({
      color: 'rgba(0, 0, 255, 1.0)',
      width: 2,
    }),
    fill: new Fill({
      color: 'rgba(0, 0, 255, 0.3)'
    })
  });

  const vectorLayer = new VectorLayer({
    source: sourceWFS,
    style: wfsStyle,
    // minZoom: 8,
  });

  return vectorLayer;
};

export default getWFSLayer;
