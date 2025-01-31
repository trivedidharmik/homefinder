import { CheckBox } from "./checkbox";
import { CheckBoxModel } from "./cbmodel";

export class CheckBoxView {
  private _checkbox: CheckBox;
  private _model: CheckBoxModel;

  // styles
  private readonly PADDING = 5;
  private readonly CHECKMARK_PADDING = 4;
  private readonly TITLE_SPACING = 10;

  constructor(checkbox: CheckBox, model: CheckBoxModel) {
    this._checkbox = checkbox;
    this._model = model;
  }

  public draw(gc: CanvasRenderingContext2D) {
    const width = this._checkbox.width!;
    const height = this._checkbox.height!;

    gc.save();
    gc.translate(this._checkbox.x, this._checkbox.y);

    // background
    gc.fillStyle = this._checkbox.fill || "white";
    gc.fillRect(0, 0, width, height);

    // border
    gc.strokeStyle = this._checkbox.border || "black";
    gc.lineWidth = 1;
    gc.strokeRect(0, 0, width, height);

    if (this._model.checked) {
      gc.beginPath();
      gc.strokeStyle = "black";
      gc.lineWidth = 2;
      // checkmark
      gc.moveTo(this.CHECKMARK_PADDING, height/2);
      gc.lineTo(width/2, height - this.CHECKMARK_PADDING);
      gc.lineTo(width - this.CHECKMARK_PADDING, this.CHECKMARK_PADDING);
      gc.stroke();
    }

    // title
    if (this._checkbox.title) {
      gc.fillStyle = "black";
      gc.font = "14px Arial";
      gc.textAlign = "left";
      gc.textBaseline = "middle";
      gc.fillText(
        this._checkbox.title,
        width + this.TITLE_SPACING,
        height/2
      );
    }

    gc.restore();
  }

  // to check if a point is within the checkbox
  public isHitCB(x: number, y: number): boolean {
    return (
      x >= 0 &&
      x <= this._checkbox.width! &&
      y >= 0 &&
      y <= this._checkbox.height!
    );
  }
}