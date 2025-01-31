import { RadioButton } from "./radiobutton";

export class RadioButtonGroup {
  private _buttons: RadioButton[] = [];
  private _checkedButton: RadioButton | null = null;

  constructor() {}

  public addButton(button: RadioButton) {
    button.group = this;
    this._buttons.push(button);
    if (button.model.checked) {
      this.checkButton(button);
    }
  }

  public checkButton(button: RadioButton) {
    if (this._checkedButton) {
      if(this._checkedButton === button) {
        this._checkedButton.model.checked = false;
        this._checkedButton = null;
        button.model.checked = false;
        return;
      }
      else{
      this._checkedButton.model.checked = false;
      }
    }
    this._checkedButton = button;
    button.model.checked = true;
  }

  public get checkedButton(): RadioButton | null {
    return this._checkedButton;
  }

  public get buttons(): RadioButton[] {
    return this._buttons;
  }
}