import Overlay from "ol/Overlay";

// References to HTML elements we will target to create our popover
const container = document.getElementById("popup");
const content = document.getElementById("popup-content");
const closer = document.getElementById("popup-closer");

// Instantiate a new Overlay
// An Overlay is an element to be displayed over the map and attached to a single map location
// https://openlayers.org/en/latest/apidoc/module-ol_Overlay-Overlay.html
const popup = new Overlay({
  element: container,
  autoPan: true,
  autoPanAnimation: {
    duration: 250,
  },
});

// Close the popop on click of the closer element
closer.onclick = () => {
  popup.setPosition(undefined);
  closer.blur();
  return false;
};

// Setup the popup position and content
const setupPopup = (coord, attributes) => {
  // Clear previous attributes
  content.innerHTML = "";
  // Set the position of the popop
  popup.setPosition(coord);
  // Iterate over the attributes, appending a simple HTML snipped for each one
  Object.entries(attributes).forEach(
    ([key, value]) => (content.innerHTML += `<p><b>${key}:</b> ${value}</p>`)
  );
};

// Initialise the popover
const initPopover = (map, layer) => {
  // Define the function which trigger on click of the map
  map.on("singleclick", (evt) => {
    // Get the previously assigned map layer
    const layerName = layer.getProperties().layerName;
    const viewResolution = map.getView().getResolution();
    // Get the URL for the GetFeatureInfo request
    const url = layer
      .getSource()
      .getFeatureInfoUrl(evt.coordinate, viewResolution, "EPSG:27700", {
        INFO_FORMAT: "application/json",
        QUERY_LAYERS: layerName,
      });
      if (url) {
        fetch(url)
        .then((response) => response.json())
        .then((geojson) => {
          // GetFeatureInfo returns a GeoJSON objevt from which we can extract the attributes to view in our popup
          setupPopup(evt.coordinate, geojson.features[0].properties);
          // Finally, add the overlay to our map
          map.addOverlay(popup);
        });
    }
  });
};

export default initPopover;