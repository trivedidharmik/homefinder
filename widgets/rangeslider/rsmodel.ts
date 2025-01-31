export class RangeSliderModel {
  private _min: number;
  private _max: number;
  private _lowerValue: number;
  private _upperValue: number;
  private _gap: number;

  constructor(min: number, max: number) {
    this._min = min;
    this._max = max;
    this._lowerValue = min;
    this._upperValue = max;
    this._gap = (max - min) * 0.15;
  }

  public get min(): number {
    return this._min;
  }
  public get max(): number {
    return this._max;
  }
  public get lowerValue(): number {
    return this._lowerValue;
  }
  public get upperValue(): number {
    return this._upperValue;
  }

  private isGap(newLower: number | null, newUpper: number | null): boolean {
    const lower = newLower ?? this._lowerValue;
    const upper = newUpper ?? this._upperValue;
    return upper - lower >= this._gap;
  }

  public setLowerValue(val: number) {
    const constrainedVal = Math.max(this._min, val);

    if (this.isGap(constrainedVal, null)) {
      this._lowerValue = Math.round(constrainedVal);
      return true;
    }
    return true;
  }

  public setUpperValue(val: number) {
    const constrainedVal = Math.min(this._max, val);

    if (this.isGap(null, constrainedVal)) {
      this._upperValue = Math.round(constrainedVal);
      return true;
    }
    return true;
  }

  public plToValue(coord: number, size: number): number {
    const percentage = Math.max(0, Math.min(1, coord / size));
    return this._min + percentage * (this._max - this._min);
  }

  public valueToPl(value: number, size: number): number {
    const boundedValue = Math.max(this._min, Math.min(this._max, value));
    const percentage = (boundedValue - this._min) / (this._max - this._min);
    return percentage * size;
  }
}
