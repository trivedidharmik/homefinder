import { setSKEventListener, SKEvent } from "../../simplekit/src/imperative-mode";
import { RadioButton, RadioButtonModel } from ".";

export class RadioButtonController {
  private _radioButton: RadioButton;
  private _model: RadioButtonModel;
  public eventHandlers: Array<
    (
      e: SKEvent,
      radioButton: RadioButton,
      model: RadioButtonModel
    ) => void
  > = [];

  constructor(rb: RadioButton, model: RadioButtonModel) {
    this._radioButton= rb;
    this._model = model;
  }

  public runHandlers(e:SKEvent) { 
    this.eventHandlers.forEach((func)=>{
        func(e, this._radioButton, this._model);
    });
  }
}
