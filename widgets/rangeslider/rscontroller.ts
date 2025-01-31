import { setSKEventListener, SKEvent } from "../../simplekit/src/imperative-mode";
import { RangeSlider, RangeSliderModel } from ".";

export class RangeSliderController {
  private _slider: RangeSlider;
  private _model: RangeSliderModel;
  public eventHandlers: Array<
    (
      e: SKEvent,
      slider: RangeSlider,
      model: RangeSliderModel
    ) => void
  > = [];

  constructor(slider: RangeSlider, model: RangeSliderModel) {
    this._slider= slider;
    this._model = model;
  }

  public runHandlers(e:SKEvent) { 
    this.eventHandlers.forEach((func)=>{
        func(e, this._slider, this._model);
    });
  }
}
