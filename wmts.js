import TileLayer from 'ol/layer/Tile';
import WMTSCapabilities from 'ol/format/WMTSCapabilities';
import WMTS, {optionsFromCapabilities} from 'ol/source/WMTS';

const token = import.meta.env.VITE_TMC_TOKEN

const getWMTSLayer = async (layerName) => {
  const response = await fetch(`https://api.themapcloud.com/maps/wmts?REQUEST=GetCapabilities&SERVICE=wmts&token=${token}`)
  const parser = new WMTSCapabilities();
  const capabilities = parser.read(await response.text());
  const options = optionsFromCapabilities(capabilities, {
    layer: layerName,
  });

  const wmtsLayer =  new TileLayer({
    source: new WMTS(options),
  });

  return wmtsLayer;
}

export default getWMTSLayer;