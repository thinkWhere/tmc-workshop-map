import TileLayer from "ol/layer/Tile";
import WMTSCapabilities from "ol/format/WMTSCapabilities";
import WMTS, { optionsFromCapabilities } from "ol/source/WMTS";

// Helper function to get a WMTS layer from theMapCloud
const getWMTSLayer = async (layerName) => {
  // The first step is to fetch the GetCapabilities document
  const response = await fetch("https://api.themapcloud.com/maps/wmts?" + new URLSearchParams({
    request: "GetCapabilities",
    service: "WMTS",
    token: import.meta.env.VITE_TMC_TOKEN,
  }));
  // We then parse this...
  const parser = new WMTSCapabilities();
  const capabilities = parser.read(await response.text());
  //...so that OL can create a WMTS Options object to configure the layer
  const options = optionsFromCapabilities(capabilities, {
    layer: layerName,
  });

  // Create the WMTS layer
  const wmtsLayer = new TileLayer({
    source: new WMTS(options),
  });

  return wmtsLayer;
};

export default getWMTSLayer;
