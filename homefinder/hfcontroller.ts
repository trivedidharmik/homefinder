import { setSKEventListener, SKEvent } from "../simplekit/src/imperative-mode";
import { HomeFinder, HomeFinderModel } from ".";

export class HomeFinderController {
  private _map: HomeFinder;
  private _model: HomeFinderModel;
  public eventHandlers: Array<
    (
      e: SKEvent,
      map: HomeFinder,
      model: HomeFinderModel
    ) => void
  > = [];

  constructor(map: HomeFinder, model: HomeFinderModel) {
    this._map = map;
    this._model = model;
  }

  public runHandlers(e:SKEvent) { 
    this.eventHandlers.forEach((func)=>{
        func(e, this._map, this._model);
    });
  }
}
