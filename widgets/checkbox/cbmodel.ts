export class CheckBoxModel {
    private _checked: boolean;
  
    constructor(initialState: boolean = false) {
      this._checked = initialState;
    }
  
    public get checked(): boolean {
      return this._checked;
    }
  
    public set checked(value: boolean) {
      this._checked = value;
    }
  
    public toggle() {
      this._checked = !this._checked;
    }
  }
  