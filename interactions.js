import { Select, Translate, Modify } from 'ol/interaction';

const select = new Select();

select.on("select", evt => console.log(evt.selected[0]))

const translate = new Translate({
  features: select.getFeatures(),
});

const modify = new Modify({
  features: select.getFeatures(),
});

const initInteractions = (map) => [select, translate, modify].forEach(interaction => map.addInteraction(interaction))

export default initInteractions;