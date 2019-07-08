import { Component, Input, Output, Renderer, QueryList, forwardRef, ElementRef, ViewChildren, EventEmitter } from '@angular/core';
import { assert, isNumber, isPresent, isString } from '../../util/util';
import { NavParams, PickerColumnCmp, PickerColumnOption, PickerOptions } from 'ionic-angular';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms'

/**
 * Generated class for the RadioSelectComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'date-picker',
  template: `<div class="picker-wrapper">
    <div class="picker-columns">
      <div class="picker-above-highlight"></div>
      <div *ngFor="let c of d.columns" [col]="c" class="picker-col" (ionChange)="_colChange($event)"></div>
      <div class="picker-below-highlight"></div>
    </div>
  </div>`,
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => DatePickerComponent),
    multi: true
  }]
})
export class DatePickerComponent implements ControlValueAccessor {
  @ViewChildren(PickerColumnCmp) _cols: QueryList<PickerColumnCmp>;
  d: PickerOptions;
  mode: string;
  @Output("onChanged")
  onChanged = new EventEmitter();

  constructor(private _elementRef: ElementRef,
              params: NavParams,
              renderer: Renderer) {
    this.d = params.data;
    this.mode = this.d.mode;

    if (this.d.cssClass) {
      this.d.cssClass.split(' ').forEach(cssClass => {
        renderer.setElementClass(_elementRef.nativeElement, cssClass, true);
      });
    }
  }

  ionViewWillLoad() {
    // normalize the data
    let data = this.d;

    // clean up dat data
    data.columns = data.columns.map(column => {
      if (!isPresent(column.options)) {
        column.options = [];
      }
      column.mode = this.mode;
      column.selectedIndex = column.selectedIndex || 0;
      column.options = column.options.map(inputOpt => {
        let opt: PickerColumnOption = {
          text: '',
          value: '',
          disabled: inputOpt.disabled
        };

        if (isPresent(inputOpt)) {
          if (isString(inputOpt) || isNumber(inputOpt)) {
            opt.text = inputOpt.toString();
            opt.value = inputOpt;

          } else {
            opt.text = isPresent(inputOpt.text) ? inputOpt.text : inputOpt.value;
            opt.value = isPresent(inputOpt.value) ? inputOpt.value : inputOpt.text;
          }
        }

        return opt;
      });
      return column;
    });
  }

  ionViewDidLoad() {
    this.refresh();
  }

  refresh() {
    this._cols.forEach(column => column.refresh());
  }

  getSelected(): any {
    let selected: {[k: string]: any} = {};
    this.d.columns.forEach((col, index) => {
      let selectedColumn = col.options[col.selectedIndex];
      selected[col.name] = {
        text: selectedColumn ? selectedColumn.text : null,
        value: selectedColumn ? selectedColumn.value : null,
        columnIndex: index,
      };
    });
    return selected;
  }

  _colChange() {
    // one of the columns has changed its selected index
    this.onChanged.emit(this.getSelected());
  }

  set value(v: any){
    // if(v) {
      // this._value = v;
      // this.onModelChange(this._value);
    // }
  }

  get value(){
      // return this._value;
      return "";
  }

  writeValue(val: any): void {
    // if (val) {
      // this._value = val;
    // }
  }

  public onModelChange: Function = () => {};
  public onModelTouched: Function = () => {};

  registerOnChange(fn: any): void {
    this.onModelChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onModelTouched = fn;
  }

}
