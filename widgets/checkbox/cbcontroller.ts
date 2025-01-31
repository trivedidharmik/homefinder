import { setSKEventListener, SKEvent } from "../../simplekit/src/imperative-mode";
import { CheckBox, CheckBoxModel } from ".";

export class CheckBoxController {
  private _checkbox: CheckBox;
  private _model: CheckBoxModel;
  public eventHandlers: Array<
    (
      e: SKEvent,
      checkbox: CheckBox,
      model: CheckBoxModel
    ) => void
  > = [];

  constructor(cb: CheckBox, model: CheckBoxModel) {
    this._checkbox = cb;
    this._model = model;
  }

  public runHandlers(e:SKEvent) { 
    this.eventHandlers.forEach((func)=>{
        func(e, this._checkbox, this._model);
    });
  }
}
