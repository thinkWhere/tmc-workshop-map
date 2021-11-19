import ImageLayer from 'ol/layer/Image';
import ImageWMS from 'ol/source/ImageWMS';

const getWMSLayer = (layerName) => {
  const wmsSource = new ImageWMS({
    url: "https://api.themapcloud.com/maps/wms",
    params: {
      layers: layerName,
      token: import.meta.env.VITE_TMC_TOKEN,
    },
    // serverType: 'geoserver',
  })
  const wmsLayer = new ImageLayer({
    source: wmsSource,
    opacity: 0.6,
    properties: {
      layerName: layerName
    }
  })
  return wmsLayer
}

export default getWMSLayer;