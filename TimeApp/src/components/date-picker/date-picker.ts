import { Component, Input, Output, Renderer, QueryList, forwardRef, ElementRef, ViewChildren, EventEmitter } from '@angular/core';
import { assert, isNumber, isPresent, isArray, isString } from '../../util/util';
import {
  DateTimeData,
  LocaleData,
  compareDates,
  convertDataToISO,
  convertFormatToKey,
  dateDataSortValue,
  dateSortValue,
  dateValueRange,
  daysInMonth,
  getValueFromFormat,
  parseDate,
  parseTemplate,
  renderDateTime,
  renderTextFormat,
  updateDate
} from '../../util/datetime-util';
import { NavParams, PickerColumnCmp, PickerColumn, PickerColumnOption, PickerOptions } from 'ionic-angular';
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
  @Input() min: string;
  @Input() max: string;
  @Input() pickerFormat: string;
  @ViewChildren(PickerColumnCmp) _cols: QueryList<PickerColumnCmp>;
  d: PickerOptions;
  mode: string;
  @Output("onChanged")
  onChanged = new EventEmitter();
  columns: Array<PickerColumn> = new Array<PickerColumn>();

  constructor(private _elementRef: ElementRef,
              params: NavParams,
              renderer: Renderer) {
    this.d = params.data;
    //this.mode = this.d.mode;

    if (this.d.cssClass) {
      this.d.cssClass.split(' ').forEach(cssClass => {
        renderer.setElementClass(_elementRef.nativeElement, cssClass, true);
      });
    }
  }

  /**
   * @hidden
   */
  generate() {
    // if a picker format wasn't provided, then fallback
    // to use the display format
    let template = this.pickerFormat || DEFAULT_FORMAT;

    if (isPresent(template)) {
      // make sure we've got up to date sizing information
      this.calcMinMax();

      // does not support selecting by day name
      // automaticallly remove any day name formats
      template = template.replace('DDDD', '{~}').replace('DDD', '{~}');
      if (template.indexOf('D') === -1) {
        // there is not a day in the template
        // replace the day name with a numeric one if it exists
        template = template.replace('{~}', 'D');
      }
      // make sure no day name replacer is left in the string
      template = template.replace(/{~}/g, '');

      // parse apart the given template into an array of "formats"
      parseTemplate(template).forEach(format => {
        // loop through each format in the template
        // create a new picker column to build up with data
        let key = convertFormatToKey(format);
        let values: any[];

        // first see if they have exact values to use for this input
        if (isPresent((<any>this)[key + 'Values'])) {
          // user provide exact values for this date part
          values = convertToArrayOfNumbers((<any>this)[key + 'Values'], key);

        } else {
          // use the default date part values
          values = dateValueRange(format, this._min, this._max);
        }

        const column: PickerColumn = {
          name: key,
          selectedIndex: 0,
          options: values.map(val => {
            return {
              value: val,
              text: renderTextFormat(format, val, null, this._locale),
            };
          })
        };

        // cool, we've loaded up the columns with options
        // preselect the option for this column
        const optValue = getValueFromFormat(this.getValueOrDefault(), format);
        const selectedIndex = column.options.findIndex(opt => opt.value === optValue);
        if (selectedIndex >= 0) {
          // set the select index for this column's options
          column.selectedIndex = selectedIndex;
        }

        // add our newly created column to the picker
        this.columns.push(column);
      });


      // Normalize min/max
      const min = <any>this._min;
      const max = <any>this._max;
      ['month', 'day', 'hour', 'minute']
        .filter(name => !this.columns.find(column => column.name === name))
        .forEach(name => {
          min[name] = 0;
          max[name] = 0;
        });

      this.divyColumns();
    }
  }


  /**
   * @hidden
   */
  divyColumns() {
    const pickerColumns = this.columns;
    let columnsWidth: number[] = [];
    let col: PickerColumn;
    let width: number;
    for (var i = 0; i < pickerColumns.length; i++) {
      col = pickerColumns[i];
      columnsWidth.push(0);

      for (var j = 0; j < col.options.length; j++) {
        width = col.options[j].text.length;
        if (width > columnsWidth[i]) {
          columnsWidth[i] = width;
        }
      }
    }

    if (columnsWidth.length === 2) {
      width = Math.max(columnsWidth[0], columnsWidth[1]);
      pickerColumns[0].align = 'right';
      pickerColumns[1].align = 'left';
      pickerColumns[0].optionsWidth = pickerColumns[1].optionsWidth = `${width * 17}px`;

    } else if (columnsWidth.length === 3) {
      width = Math.max(columnsWidth[0], columnsWidth[2]);
      pickerColumns[0].align = 'right';
      pickerColumns[1].columnWidth = `${columnsWidth[1] * 17}px`;
      pickerColumns[0].optionsWidth = pickerColumns[2].optionsWidth = `${width * 17}px`;
      pickerColumns[2].align = 'left';
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

/**
 * @hidden
 * Use to convert a string of comma separated numbers or
 * an array of numbers, and clean up any user input
 */
function convertToArrayOfNumbers(input: any, type: string): number[] {
  if (isString(input)) {
    // convert the string to an array of strings
    // auto remove any whitespace and [] characters
    input = input.replace(/\[|\]|\s/g, '').split(',');
  }

  let values: number[];
  if (isArray(input)) {
    // ensure each value is an actual number in the returned array
    values = input
      .map((num: any) => parseInt(num, 10))
      .filter(isFinite);
  }

  if (!values || !values.length) {
    console.warn(`Invalid "${type}Values". Must be an array of numbers, or a comma separated string of numbers.`);
  }

  return values;
}

/**
 * @hidden
 * Use to convert a string of comma separated strings or
 * an array of strings, and clean up any user input
 */
function convertToArrayOfStrings(input: any, type: string): string[] {
  if (isPresent(input)) {
    if (isString(input)) {
      // convert the string to an array of strings
      // auto remove any [] characters
      input = input.replace(/\[|\]/g, '').split(',');
    }

    var values: string[];
    if (isArray(input)) {
      // trim up each string value
      values = input.map((val: string) => val.trim());
    }

    if (!values || !values.length) {
      console.warn(`Invalid "${type}Names". Must be an array of strings, or a comma separated string.`);
    }

    return values;
  }
}

const DEFAULT_FORMAT = 'YYYY MMM D';
