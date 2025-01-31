import { SKElement } from "../simplekit/src/widget/";
import { SKEvent, SKMouseEvent } from "../simplekit/src/events";
import { HomeFinderController } from "./hfcontroller";
import { HomeFinderModel, HomePoint } from "./hfmodel";
import { HomeFinderView } from "./hfview";

// A Map Widget for SimpleKit that displays
export class HomeFinder extends SKElement {
  private _model: HomeFinderModel;
  private _view: HomeFinderView;
  private _controller: HomeFinderController;

  constructor(
    points: HomePoint[],
    {
      x = 0,
      y = 0,
      width = 400,
      height = 400,
      fill = "black",
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
    this._model = new HomeFinderModel(points);
    this._view = new HomeFinderView(this, this._model);
    this._controller = new HomeFinderController(this, this._model);
  }

  draw(gc: CanvasRenderingContext2D) {
    super.draw(gc);
    this._view.draw(gc);
  }

    handleMouseEvent(me: SKMouseEvent):boolean {
        this._controller.runHandlers(me);
        return true;
    }
  public get drawMapFeatureFunctions(): Array<
    (
      gc: CanvasRenderingContext2D,
      x: number,
      y: number,
      width: number | undefined,
      height: number | undefined,
      data: {} | undefined
    ) => void
  > {
    return this._view.drawMapFeatureFunctions;
  }

  public setSelectedProperty(property: any) {
    this._view.setSelectedProperty(property);
  }
  public get model(): HomeFinderModel {
    return this._model;
  }

  public addMapEventHandler(func: (SKEvent, HomeFinder, HomeFinderModel) => void) {
        this._controller.eventHandlers.push(func);
  }
}
