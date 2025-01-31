// Define the property interface based on JSON structure
export interface HomePoint {
    latitude: number;
    longitude: number;
    data: {};
    dataDisplay: string;
}

export class HomeFinderModel {
  private _points!: HomePoint[]; 

  private _minLon!: number;
  private _maxLon!: number;
  private _minLat!: number;
  private _maxLat!: number;
  private _selectedProperty: HomePoint | null = null;

  constructor(points: HomePoint[]) {
    this.points = points;
  }

  public get points(): HomePoint[] {
    return this._points;
  }

  public set points(points: HomePoint[]) {
    this._points = points;
    // to not recalculate if they are already set
  if (!this._minLon || !this._maxLon || !this._minLat || !this._maxLat) {
    this._setMinMax();
  }
  }
  
  public get selectedProperty(): HomePoint | null {
    return this._selectedProperty;
  }

  public set selectedProperty(property: HomePoint | null) {
    this._selectedProperty = property;
  }

  private _setMinMax(): void {
    //determine the min and max values for scaling
    //the map while drawing, so that everything is visible
    this._minLon =
      this._points.reduce((prev, curr) =>
        prev.longitude < curr.longitude ? prev : curr
      ).longitude - 0.0015;
    this._minLat =
      this._points.reduce((prev, curr) =>
        prev.latitude < curr.latitude ? prev : curr
      ).latitude - 0.0015;
    this._maxLon =
      this._points.reduce((prev, curr) =>
        prev.longitude > curr.longitude ? prev : curr
      ).longitude + 0.0015;
    this._maxLat =
      this._points.reduce((prev, curr) =>
        prev.latitude > curr.latitude ? prev : curr
      ).latitude + 0.0015;
  }

  // Function to convert latitude and longitude to canvas coordinates
  public latLonToCanvas(
    lat: number,
    lon: number,
    canvasWidth: number = 400,
    canvasHeight: number = 400
  ) {
    const x =
      ((lon - this._minLon) / (this._maxLon - this._minLon)) * canvasWidth;
    const y =
      canvasHeight -
      ((lat - this._minLat) / (this._maxLat - this._minLat)) * canvasHeight;
    return { x,y };
  }
}