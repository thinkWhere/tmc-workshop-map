import Overlay from "ol/Overlay";

const container = document.getElementById("popup");
const content = document.getElementById("popup-content");
const closer = document.getElementById("popup-closer");

const popup = new Overlay({
  element: container,
  autoPan: true,
  autoPanAnimation: {
    duration: 250,
  },
});

closer.onclick = () => {
  popup.setPosition(undefined);
  closer.blur();
  return false;
};

const setupPopup = (coord, attributes) => {
  content.innerHTML = "";
  popup.setPosition(coord);
  Object.entries(attributes).forEach(
    ([key, value]) => (content.innerHTML += `<p><b>${key}:</b> ${value}</p>`)
  );
};

const initPopover = (map, layer) => {
  map.on("singleclick", (e) => {
    const layerName = layer.getProperties().layerName;
    const viewResolution = map.getView().getResolution();
    const url = layer
      .getSource()
      .getFeatureInfoUrl(e.coordinate, viewResolution, "EPSG:27700", {
        INFO_FORMAT: "application/json",
        QUERY_LAYERS: layerName,
      });
      if (url) {
        fetch(url)
        .then((response) => response.json())
        .then((geojson) => {
          console.log(geojson)
          setupPopup(e.coordinate, geojson.features[0].properties);
          map.addOverlay(popup);
        });
    }
  });
};

export default initPopover;