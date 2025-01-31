import { HomeFinder, HomeFinderModel, HomePoint } from '.';

export class HomeFinderView {
  private _map: HomeFinder;
  private _model: HomeFinderModel;
  private _selectedProperty: HomePoint | null = null;

  constructor(map: HomeFinder, model: HomeFinderModel) {
    this._model = model;
    this._map = map;
  }

  public setSelectedProperty(property: any) {
    this._selectedProperty = property;
  }

  // a list of functions that will be called to draw different map features (e.g., a river or roads)
  public drawMapFeatureFunctions: Array<
    (
      gc: CanvasRenderingContext2D,
      x: number,
      y: number,
      width: number | undefined,
      height: number | undefined
    ) => void
  > = [];

  //draw a marker on the map
  public drawMarker(
    gc: CanvasRenderingContext2D,
    lat: number,
    lon: number,
    displayData: string,
    data: {}
  ) {
    const { x, y } = this._model.latLonToCanvas(
      lat,
      lon,
      this._map.width,
      this._map.height
    );
    gc.save();
    gc.translate(this._map.x, this._map.y);
    // console.log(lat, lon, this._width, this._height);
    const isSelected =
      this._model.selectedProperty &&
      this._model.selectedProperty.data['id'] === data['id'];
    gc.beginPath();
    //gc.arc(x, y, 5, 0, 2 * Math.PI);
    //gc.fillStyle = "yellow";
    gc.arc(x, y, isSelected ? 7 : 5, 0, 2 * Math.PI);
    gc.fillStyle = isSelected ? 'red' : 'yellow';
    gc.fill();
    gc.closePath();
    gc.fillStyle = 'white';

    gc.fillText(displayData, x - 10, y - 10);

    gc.restore();
  }

  private drawPropertyDetails(gc: CanvasRenderingContext2D) {
    gc.save();
    gc.translate(this._map.x, this._map.y + this._map.height! + 20);

    // Set text properties
    gc.font = '16px Arial';
    gc.fillStyle = 'black';

    if (
      !this._model.selectedProperty ||
      !this._model.points.includes(this._model.selectedProperty)
    ) {
      // Display default text
      gc.fillText('Click marker for details', 10, 10);
    } else {
      const property = this._model.selectedProperty;
      const lineHeight = 20;
      let currentY = 10;

      gc.fillText(`Address: ${property.data['address']}`, 10, currentY);
      currentY += lineHeight;
      gc.fillText(
        `Price: $${property.data['price'].toLocaleString()}`,
        10,
        currentY
      );
      currentY += lineHeight;
      gc.fillText(
        `Bedrooms: ${property.data['bedrooms']} | Bathrooms: ${property.data['bathrooms']}`,
        10,
        currentY
      );
      currentY += lineHeight;
      gc.fillText(`Type: ${property.data['property_type']}`, 10, currentY);
      currentY += lineHeight;

      // features
      if (property.data['features'] && property.data['features'].length > 0) {
        gc.fillText(
          `Features: ${property.data['features'].join(', ')}`,
          10,
          currentY
        );
        currentY += lineHeight;
      }

      // used ai for wraping the text
      if (property.data['description']) {
        const maxWidth = this._map.width! - 20;
        const words = property.data['description'].split(' ');
        let line = '';

        words.forEach((word) => {
          const testLine = line + word + ' ';
          const metrics = gc.measureText(testLine);

          if (metrics.width > maxWidth) {
            gc.fillText(line, 10, currentY);
            currentY += lineHeight;
            line = word + ' ';
          } else {
            line = testLine;
          }
        });

        if (line.length > 0) {
          gc.fillText(line, 10, currentY);
        }
      }
    }

    gc.restore();
  }

  //draw the widget
  draw(gc: CanvasRenderingContext2D) {
    gc.save();
    if (this._map.fill!) {
      gc.fillStyle = this._map.fill;
      gc.fillRect(
        this._map.x!,
        this._map.y!,
        this._map.width!,
        this._map.height!
      );
    }

    //call any map drawing functions to display map features
    this.drawMapFeatureFunctions.forEach((func) => {
      func(gc, this._map.x, this._map.y, this._map.width, this._map.height);
    });

    // Draw each marker on the map
    this._model.points.forEach((property) => {
      const { latitude, longitude } = property;
      this.drawMarker(
        gc,
        latitude,
        longitude,
        property.dataDisplay,
        property.data
      );
    });

    //draw the border if there is one
    if (this._map.border) {
      gc.strokeStyle = this._map.border;
      gc.lineWidth = 1;
      gc.strokeRect(
        this._map.x,
        this._map.y,
        this._map.width,
        this._map.height
      );
    }

    // Draw property details
    this.drawPropertyDetails(gc);

    gc.restore();
  }
}
