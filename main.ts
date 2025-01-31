import {
  SKEvent,
  SKLabel,
  SKMouseEvent,
} from './simplekit/src/imperative-mode';
import {
  startSimpleKit,
  SKContainer,
  Layout,
  setSKRoot,
} from './simplekit/src/imperative-mode';

import { HomePoint, HomeFinder, HomeFinderModel } from './homefinder';
import { RangeSlider } from './widgets/rangeslider/rangeslider';
import { RangeSliderModel } from './widgets/rangeslider';
import { CheckBox } from './widgets/checkbox/checkbox';
import { RadioButtonGroup } from './widgets/radiobutton/rbgroup';
import { RadioButton } from './widgets/radiobutton/radiobutton';

//inteface for storing data on properties
interface Property extends HomePoint {
  data: {
    id: number;
    address: string;
    price: number;
    bedrooms: number;
    bathrooms: number;
    property_type: string;
    features: string[];
    description: string;
  };
}

function calculateDistance(
  x1: number,
  y1: number,
  x2: number,
  y2: number
): number {
  const dx = x2 - x1;
  const dy = y2 - y1;
  return Math.sqrt(dx * dx + dy * dy);
}

// Container Setup
const root = new SKContainer({ width: 1000, height: 800 });
root.fill = 'darkgrey';
root.layoutMethod = Layout.makeCentredLayout();

const panel = new SKContainer({ width: 1000, height: 800 });
const panelColor = "#ebebeb";
panel.fill = panelColor;
panel.layoutMethod = Layout.makeFixedLayout();

const verticalContainer = new SKContainer({ width: 200, height: 800, x: 800 });
verticalContainer.fill = '#0a6980';
const title = new SKLabel({ width: 200, y: 0, height: 40, text: 'Filters' });
title.font = 'bold 28px Arial';
title.fontColour = 'white';
title.fill = '#242f40';
verticalContainer.addChild(title);

const cbContainer = new SKContainer({ width: 200, height: 140, x: 0, y: 480 });
cbContainer.fill = panelColor;
const cbTitle = new SKLabel({ width: 200, text: 'Features' });
cbTitle.fill = '#c0c0c0';
cbContainer.addChild(cbTitle);
const rbContainer = new SKContainer({ width: 200, height: 180, x: 0, y: 620 });
rbContainer.fill = panelColor;
const rbTitle = new SKLabel({ width: 200, text: 'Property Type' });
rbTitle.fill = '#c0c0c0';
rbContainer.addChild(rbTitle);
verticalContainer.addChild(cbContainer);
verticalContainer.addChild(rbContainer);

let propertiesForSale: Property[] = [];
let jsonData: {}[] = [];

try {
  const response = await fetch('fredericton_properties.json');
  jsonData = await response.json();

  jsonData.forEach((record) => {
    let prop: Property = {
      latitude: 0,
      longitude: 0,
      dataDisplay: '',
      data: {
        id: -1,
        address: '',
        price: -1,
        bedrooms: -1,
        bathrooms: -1,
        property_type: '',
        features: [],
        description: '',
      },
    };

    prop.latitude = record['latitude'];
    prop.longitude = record['longitude'];
    prop.data.address = record['address'];
    prop.data.description = record['description'];
    prop.data.features = record['features'];
    prop.data.property_type = record['property_type'];
    prop.data.bathrooms = record['bathrooms'];
    prop.data.bedrooms = record['bedrooms'];
    prop.data.id = record['id'];
    prop.data.price = record['price'];
    prop.dataDisplay = '';

    propertiesForSale.push(prop);
  });
} catch (error) {
  console.error('Error loading properties:', error);
}

// Map Widget
const map = new HomeFinder(propertiesForSale, { width: 800, height: 600 });
map.border = 'black';

// Range Slider Setup
const sliderVals = [
  { title: 'Price Range', min: 100000, max: 1000000, y: 60 },
  { title: 'Bedrooms', min: 1, max: 7, y: 200 },
  { title: 'Bathrooms', min: 1, max: 5, y: 340 },
];

const sliders = sliderVals.map(
  (sliderVal) =>
    new RangeSlider(sliderVal.min, sliderVal.max, sliderVal.title, {
      width: 160,
      height: 100,
      x: 20,
      y: sliderVal.y,
      fill: panelColor,
    })
);

const [priceSlider, bedSlider, bathSlider] = sliders;

// Checkbox
const checkboxVals = [
  { label: 'Waterfront', y: 40 },
  { label: 'Pool', y: 70 },
  { label: 'Garage', y: 100 },
];

const checkboxes = checkboxVals.map(
  (cb) =>
    new CheckBox(cb.label, {
      x: 20,
      y: cb.y,
      width: 20,
      height: 20,
      checked: false,
    })
);

const [cb1, cb2, cb3] = checkboxes;

// Radio Buttons
const radioVals = [
  { label: 'Residential', y: 40 },
  { label: 'Condo', y: 70 },
  { label: 'Recreational', y: 100 },
  { label: 'Vacant Land', y: 130 },
];

const radioGroup = new RadioButtonGroup();
const radioButtons = radioVals.map(
  (rb) =>
    new RadioButton(rb.label, {
      x: 20,
      y: rb.y,
      width: 20,
      height: 20,
    })
);

radioButtons.forEach((button) => radioGroup.addButton(button));

// Event Handlers
let isDragging = false;
let activeHandle: 'lower' | 'upper' | null = null;

map.addMapEventHandler(
  (e: SKEvent, map: HomeFinder, model: HomeFinderModel) => {
    if (e.type === 'click') {
      const mouseEvent = e as SKMouseEvent;
      let clickedProperty: HomePoint | null = null;

      model.points.forEach((p) => {
        const { x, y } = model.latLonToCanvas(
          p.latitude,
          p.longitude,
          map.width,
          map.height
        );
        if (
          calculateDistance(
            x + panel.x,
            y + panel.y,
            mouseEvent.x,
            mouseEvent.y
          ) <= 5
        ) {
          clickedProperty = p;
        }
      });

      model.selectedProperty = clickedProperty;
      map.setSelectedProperty(clickedProperty);
    }
  }
);

checkboxes.forEach((checkbox) => {
  checkbox.addCheckboxEventHandler((e, checkbox, model) => {
    if (e instanceof SKMouseEvent && e.type === 'click') {
      model.toggle();
      updatePoints();
    }
  });
});

radioButtons.forEach((radio) => {
  radio.addRadioButtonEventHandler((e, radioButton, model) => {
    if (e instanceof SKMouseEvent && e.type === 'click') {
      radioGroup.checkButton(radioButton);
      updatePoints();
    }
  });
});

sliders.forEach((slider) => {
  slider.addSliderEventHandler(
    (e: SKEvent, slider: RangeSlider, model: RangeSliderModel) => {
      if (e instanceof SKMouseEvent) {
        const mouseEvent = e as SKMouseEvent;
        const localX = mouseEvent.x - slider.x - panel.x - verticalContainer.x;
        const localY = mouseEvent.y - slider.y - panel.y - verticalContainer.y;

        switch (mouseEvent.type) {
          case 'mousedown':
            if (slider.view.isHitHandle(localX, localY, model.lowerValue)) {
              isDragging = true;
              activeHandle = 'lower';
            } else if (
              slider.view.isHitHandle(localX, localY, model.upperValue)
            ) {
              isDragging = true;
              activeHandle = 'upper';
            }
            updatePoints();
            break;

          case 'mousemove':
            if (isDragging && activeHandle) {
              const value = slider.view.mouseToValue(localX);
              if (activeHandle === 'lower') {
                model.setLowerValue(value);
              } else {
                model.setUpperValue(value);
              }
              updatePoints();
            }
            break;

          case 'mouseup':
          case 'mouseleave':
            isDragging = false;
            activeHandle = null;
            updatePoints();
            break;
        }
      }
    }
  );
});

window.addEventListener('mouseup', () => {
  isDragging = false;
  activeHandle = null;
});

// Update Function
function updatePoints() {
  map.model.points = propertiesForSale.filter((p) => {
    const sliderFilters =
      p.data.price >= priceSlider.model.lowerValue &&
      p.data.price <= priceSlider.model.upperValue &&
      p.data.bedrooms >= bedSlider.model.lowerValue &&
      p.data.bedrooms <= bedSlider.model.upperValue &&
      p.data.bathrooms >= bathSlider.model.lowerValue &&
      p.data.bathrooms <= bathSlider.model.upperValue;

    const hasWaterfront =
      !cb1.model.checked ||
      p.data.features.some((feature) =>
        feature.toLowerCase().includes('waterfront')
      );
    const hasPool =
      !cb2.model.checked ||
      p.data.features.some((feature) => feature.toLowerCase().includes('pool'));
    const hasGarage =
      !cb3.model.checked ||
      p.data.features.some((feature) =>
        feature.toLowerCase().includes('garage')
      );

    const propertyTypeFilter =
      !radioGroup.checkedButton ||
      p.data.property_type.toLowerCase() ===
        radioGroup.checkedButton.title.toLowerCase();

    return (
      sliderFilters &&
      hasWaterfront &&
      hasPool &&
      hasGarage &&
      propertyTypeFilter
    );
  });
}

panel.addChild(map);
panel.addChild(verticalContainer);

sliders.forEach((slider) => verticalContainer.addChild(slider));
checkboxes.forEach((checkbox) => cbContainer.addChild(checkbox));
radioButtons.forEach((radio) => rbContainer.addChild(radio));

root.addChild(panel);

// Initialize SimpleKit
setSKRoot(root);
startSimpleKit();
