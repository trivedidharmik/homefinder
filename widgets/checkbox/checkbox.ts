import { SKElement } from "../../simplekit/src/widget/";
import { SKEvent, SKMouseEvent } from "../../simplekit/src/events";
import { CheckBoxController } from "./cbcontroller";
import { CheckBoxModel } from "./cbmodel";
import { CheckBoxView } from "./cbview";

// A Map Widget for SimpleKit that displays
export class CheckBox extends SKElement {
  private _model: CheckBoxModel;
  private _view: CheckBoxView;
  private _controller: CheckBoxController;
  private _title: string;

  constructor(
    title: string = "",
    {
      x = 0,
      y = 0,
      width = 20,
      height = 20,
      fill = "white",
      border = "black",
      checked = false
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
    this._model = new CheckBoxModel();
    this._view = new CheckBoxView(this, this._model);
    this._controller = new CheckBoxController(this, this._model);
  }

  draw(gc: CanvasRenderingContext2D) {
    super.draw(gc);
    this._view.draw(gc);
  }

  handleMouseEvent(me: SKMouseEvent): boolean {
    this._controller.runHandlers(me);
    return true;
  }

    get view(): CheckBoxView {
        return this._view;
      }
    
      get model(): CheckBoxModel {
        return this._model;
      }

      get title(): string {
        return this._title;
      }

  public addCheckboxEventHandler(
    func: (SKEvent, CheckBox, CheckBoxModel) => void
  ) {
    this._controller.eventHandlers.push(func);
  }
}
