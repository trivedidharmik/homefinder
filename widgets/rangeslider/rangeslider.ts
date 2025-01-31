import { SKElement } from "../../simplekit/src/widget/";
import { SKEvent, SKMouseEvent } from "../../simplekit/src/events";
import { RangeSliderController } from "./rscontroller";
import { RangeSliderModel } from "./rsmodel";
import { RangeSliderView } from "./rsview";

// A Map Widget for SimpleKit that displays
export class RangeSlider extends SKElement {
  private _model: RangeSliderModel;
  private _view: RangeSliderView;
  private _controller: RangeSliderController;
  private _title: string;

  constructor(
    min: number,
    max: number,
    title: string = "",
    {
      x = 0,
      y = 0,
      width = 400,
      height = 400,
      fill = "white",
      border = "black",
    } = {}
  ) {
    super({
      x: x,
      y: y,
      width: width,
      height: height,
      fill: fill,
      border: border,
    });
    this._title = title;
    this._model = new RangeSliderModel(min, max);
    this._view = new RangeSliderView(this, this._model);
    this._controller = new RangeSliderController(this, this._model);
  }

  draw(gc: CanvasRenderingContext2D) {
    super.draw(gc);
    this._view.draw(gc);
  }

  handleMouseEvent(me: SKMouseEvent): boolean {
    this._controller.runHandlers(me);
    return true;
  }

    get view(): RangeSliderView {
        return this._view;
      }
    
      get model(): RangeSliderModel {
        return this._model;
      }

      get title(): string {
        return this._title;
      }

  public addSliderEventHandler(
    func: (SKEvent, RangeSlider, RangeSliderModel) => void
  ) {
    this._controller.eventHandlers.push(func);
  }
}
