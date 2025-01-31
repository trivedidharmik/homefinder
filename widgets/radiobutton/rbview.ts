import { RadioButton } from "./radiobutton";
import { RadioButtonModel } from "./rbmodel";

export class RadioButtonView {
  private _radio: RadioButton;
  private _model: RadioButtonModel;

  private readonly PADDING = 5;
  private readonly INNER_CIRCLE_RATIO = 0.4;
  private readonly LABEL_SPACING = 10;

  constructor(radio: RadioButton, model: RadioButtonModel) {
    this._radio = radio;
    this._model = model;
  }

  public draw(gc: CanvasRenderingContext2D) {
    const width = this._radio.width!;
    const height = this._radio.height!;
    const radius = 2 * Math.min(width, height) / 3; // my custom  formula for making radius customizable
 
    gc.save();
    gc.translate(this._radio.x, this._radio.y);

    // outer circle
    gc.beginPath();
    gc.arc(width/2, height/2, radius - this.PADDING, 0, 2 * Math.PI);
    gc.fillStyle = this._radio.fill || "white";
    gc.fill();
    gc.strokeStyle = this._radio.border || "black";
    gc.lineWidth = 1;
    gc.stroke();

    // inner circle if selected
    if (this._model.checked) {
      gc.beginPath();
      gc.arc(
        width/2,
        height/2,
        radius * this.INNER_CIRCLE_RATIO,
        0,
        2 * Math.PI
      );
      gc.fillStyle = "black";
      gc.fill();
    }

    // label
    if (this._radio.title) {
      gc.fillStyle = "black";
      gc.font = "14px Arial";
      gc.textAlign = "left";
      gc.textBaseline = "middle";
      gc.fillText(
        this._radio.title,
        width + this.LABEL_SPACING,
        height/2
      );
    }

    gc.restore();
  }

  public isHit(x: number, y: number): boolean {
    const centerX = this._radio.width! / 2;
    const centerY = this._radio.height! / 2;
    const radius = Math.min(this._radio.width!, this._radio.height!) / 2;
    
    const distance = Math.sqrt(
      Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2)
    );
    
    return distance <= radius;
  }
}