import { SKElement } from '../../simplekit/src/widget/';
import { SKEvent, SKMouseEvent } from '../../simplekit/src/events';
import { RadioButtonController } from './rbcontroller';
import { RadioButtonModel } from './rbmodel';
import { RadioButtonView } from './rbview';
import { RadioButtonGroup } from './rbgroup';

// A Map Widget for SimpleKit that displays
export class RadioButton extends SKElement {
  private _model: RadioButtonModel;
  private _view: RadioButtonView;
  private _controller: RadioButtonController;
  private _title: string;
  private _grp: RadioButtonGroup | null = null;

  constructor(
    title: string = '',
    {
      x = 0,
      y = 0,
      width = 20,
      height = 20,
      fill = 'white',
      border = 'black',
      checked = false,
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
    this._model = new RadioButtonModel();
    this._view = new RadioButtonView(this, this._model);
    this._controller = new RadioButtonController(this, this._model);
  }

  draw(gc: CanvasRenderingContext2D) {
    super.draw(gc);
    this._view.draw(gc);
  }

  handleMouseEvent(me: SKMouseEvent): boolean {
    this._controller.runHandlers(me);
    return true;
  }

  get view(): RadioButtonView {
    return this._view;
  }

  get model(): RadioButtonModel {
    return this._model;
  }

  get group(): RadioButtonGroup | null {
    return this._grp;
  }

  set group(grp: RadioButtonGroup | null) {
    this._grp = grp;
  }

  get title(): string {
    return this._title;
  }

  public addRadioButtonEventHandler(
    func: (SKEvent, RadioButton, RadioButtonModel) => void
  ) {
    this._controller.eventHandlers.push(func);
  }
}
