import { Select, Translate, Modify } from 'ol/interaction';

// Simple function to log out the area of a feature
const logFeatureArea = (feature) => {
  const selectedGeom = feature.getGeometry();
  const area = selectedGeom.getArea().toFixed(2);
  console.log(`Area: ${area}m²`);
}

// Create a new "Select" interaction
// https://openlayers.org/en/latest/apidoc/module-ol_interaction_Select-Select.html
const select = new Select();

// Attach the logFeatureArea to an event on the select interaction
select.on("select", evt => logFeatureArea(evt.selected[0]))

// Create a new "Translate" interaction
// https://openlayers.org/en/latest/apidoc/module-ol_interaction_Translate-Translate.html
const translate = new Translate({
  features: select.getFeatures(),
});

// Create a new "Modify" interaction
// https://openlayers.org/en/latest/apidoc/module-ol_interaction_Modify-Modify.html
const modify = new Modify({
  features: select.getFeatures(),
});

// Iterate over the interactions created above, and add them to the map
const initInteractions = (map) => [select, translate, modify].forEach(interaction => map.addInteraction(interaction))

export default initInteractions;