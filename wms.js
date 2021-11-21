import ImageLayer from 'ol/layer/Image';
import ImageWMS from 'ol/source/ImageWMS';

// Helper function to get a WMS layer from theMapCloud
const getWMSLayer = (layerName) => {
  // Define the source of the WMS layer
  const wmsSource = new ImageWMS({
    url: "https://api.themapcloud.com/maps/wms",
    params: {
      layers: layerName,
      token: import.meta.env.VITE_TMC_TOKEN,
    }
  })
  // Create the WMS layer
  const wmsLayer = new ImageLayer({
    source: wmsSource,
    opacity: 0.6,
    // Assigning layerName here is not mandatory, but will help us reference this layer later
    properties: {
      layerName: layerName
    }
  });
  return wmsLayer;
}

export default getWMSLayer;