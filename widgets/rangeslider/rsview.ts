import { RangeSlider } from './rangeslider';
import { RangeSliderModel } from './rsmodel';

export class RangeSliderView {
  private _slider: RangeSlider;
  private _model: RangeSliderModel;

  // styles
  private readonly TITLE_PADDING = 10;
  private readonly SLIDER_PADDING = 20;
  private readonly HANDLE_WIDTH = 15;
  private readonly HANDLE_HEIGHT = 30;
  private readonly TRACK_HEIGHT = 15;
  private readonly LABEL_OFFSET = 20;
  private readonly HANDLE_HITBOX_PADDING = 5;

  constructor(slider: RangeSlider, model: RangeSliderModel) {
    this._slider = slider;
    this._model = model;
  }

  // Formatter
  private formatValue(value: number): string {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `${(value / 1000).toFixed(0)}k`;
    }
    return Math.round(value).toString();
  }

  private calculateFontSize(): number {
    const baseSize = Math.min(this._slider.width!, this._slider.height!) / 20;
    return Math.max(12, Math.min(18, baseSize));
  }

  // get the usable track width
  private getTrackWidth(): number {
    return this._slider.width! - 2 * this.SLIDER_PADDING;
  }

  // get slider center position
  private getSliderCenterY(): number {
    const sliderAreaY =
      this.TITLE_PADDING + this.calculateFontSize() + this.SLIDER_PADDING;
    return sliderAreaY + (this._slider.height! - sliderAreaY) / 2;
  }

  public draw(gc: CanvasRenderingContext2D) {
    const width = this._slider.width!;
    const height = this._slider.height!;
    const fontSize = this.calculateFontSize();

    gc.save();
    gc.translate(this._slider.x, this._slider.y);

    // background
    if (this._slider.fill) {
      gc.fillStyle = this._slider.fill;
      gc.fillRect(0, 0, width, height);
    }

    // title
    if (this._slider.title) {
      gc.fillStyle = 'black';
      gc.font = `${fontSize}px Arial`;
      gc.textAlign = 'center';
      gc.fillText(this._slider.title, width / 2, this.TITLE_PADDING + fontSize);
    }

    const centerY = this.getSliderCenterY();
    const trackWidth = this.getTrackWidth();

    //  track
    gc.fillStyle = 'lightgrey';
    gc.fillRect(
      this.SLIDER_PADDING,
      centerY - this.TRACK_HEIGHT / 2,
      trackWidth,
      this.TRACK_HEIGHT
    );

    const lowerX =
      this.SLIDER_PADDING +
      this._model.valueToPl(this._model.lowerValue, trackWidth);
    const upperX =
      this.SLIDER_PADDING +
      this._model.valueToPl(this._model.upperValue, trackWidth);

    gc.fillStyle = 'lightblue';
    gc.fillRect(
      lowerX,
      centerY - this.TRACK_HEIGHT / 2,
      upperX - lowerX,
      this.TRACK_HEIGHT
    );

    this.drawHandle(gc, lowerX - this.HANDLE_WIDTH / 2, centerY);
    this.drawHandle(gc, upperX - this.HANDLE_WIDTH / 2, centerY);

    gc.fillStyle = 'black';
    gc.font = `${fontSize * 0.8}px Arial`;
    gc.textAlign = 'center';

    gc.fillText(
      this.formatValue(this._model.lowerValue),
      lowerX,
      centerY - this.LABEL_OFFSET
    );
    gc.fillText(
      this.formatValue(this._model.upperValue),
      upperX,
      centerY - this.LABEL_OFFSET
    );

    // border
    if (this._slider.border) {
      gc.strokeStyle = this._slider.border;
      gc.strokeRect(0, 0, width, height);
    }

    gc.restore();
  }

  private drawHandle(gc: CanvasRenderingContext2D, x: number, centerY: number) {
    gc.fillStyle = 'darkgrey';
    gc.fillRect(
      x,
      centerY - this.HANDLE_HEIGHT / 2,
      this.HANDLE_WIDTH,
      this.HANDLE_HEIGHT
    );

    gc.strokeStyle = '#000000';
    gc.lineWidth = 1;
    gc.strokeRect(
      x,
      centerY - this.HANDLE_HEIGHT / 2,
      this.HANDLE_WIDTH,
      this.HANDLE_HEIGHT
    );
  }

  // Used some part of this method from AI to get relative positions.
  public mouseToValue(x: number): number {
    const trackWidth = this.getTrackWidth();
    const relativeX = Math.max(
      0,
      Math.min(trackWidth, x - this.SLIDER_PADDING)
    );
    const percentage = relativeX / trackWidth;
    return this._model.min + percentage * (this._model.max - this._model.min);
  }

  public isHitHandle(x: number, y: number, handleValue: number): boolean {
    const trackWidth = this.getTrackWidth();
    const centerY = this.getSliderCenterY();
    const handleX =
      this.SLIDER_PADDING + this._model.valueToPl(handleValue, trackWidth);

    return (
      x >= handleX - this.HANDLE_WIDTH - this.HANDLE_HITBOX_PADDING &&
      x <= handleX + this.HANDLE_HITBOX_PADDING &&
      y >= centerY - this.HANDLE_HEIGHT / 2 - this.HANDLE_HITBOX_PADDING &&
      y <= centerY + this.HANDLE_HEIGHT / 2 + this.HANDLE_HITBOX_PADDING
    );
  }
}
