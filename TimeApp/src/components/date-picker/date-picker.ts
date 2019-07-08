import { Component, Input, Output, Renderer, QueryList, forwardRef, ElementRef, ViewChildren, EventEmitter } from '@angular/core';
import { assert, clamp, isArray, isNumber, isBlank, isObject, isPresent, isString } from '../../util/util';
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
      <div *ngFor="let c of option.columns" [col]="c" class="picker-col" (ionChange)="_colChange($event)"></div>
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

  _min: DateTimeData;
  _max: DateTimeData;
  _value: DateTimeData;
  _locale: LocaleData = {};

  @Input() min: string;
  @Input() max: string;
  @Input() pickerFormat: string;
  @Input() initialValue: string;
  @Input() yearValues: any;
  @ViewChildren(PickerColumnCmp) _cols: QueryList<PickerColumnCmp>;
  mode: string;
  @Output("onChanged")
  onChanged = new EventEmitter();
  option: PickerOptions = new PickerOptions();

  constructor(private _elementRef: ElementRef,
              params: NavParams,
              renderer: Renderer) {
    if (this.option.cssClass) {
      this.option.cssClass.split(' ').forEach(cssClass => {
        renderer.setElementClass(_elementRef.nativeElement, cssClass, true);
      });
    }

    this.generate();
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
        this.option.columns.push(column);
      });


      // Normalize min/max
      const min = <any>this._min;
      const max = <any>this._max;
      ['month', 'day', 'hour', 'minute']
        .filter(name => !this.option.columns.find(column => column.name === name))
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
    const pickerColumns = this.option.columns;
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

  ionViewWillEnter() {
    this.generate();
  }

  ionViewWillLoad() {
    // normalize the data
    let data = this.option;

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

  /**
   * @hidden
   */
  getValueOrDefault(): DateTimeData {
    if (this.hasValue()) {
      return this._value;
    }

    const initialDateString = this.getDefaultValueDateString();
    const _default = {};
    updateDate(_default, initialDateString);
    return _default;
  }

  /**
   * Get the default value as a date string
   * @hidden
   */
  getDefaultValueDateString() {
    if (this.initialValue) {
      return this.initialValue;
    }

    const nowString = (new Date).toISOString();
    if (this.max) {
      const now = parseDate(nowString);
      const max = parseDate(this.max);

      let v;
      for (let i in max) {
        v = (<any>max)[i];
        if (v === null) {
          (<any>max)[i] = (<any>now)[i];
        }
      }

      const diff = compareDates(now, max);
      // If max is before current time, return max
      if (diff > 0) {
        return this.max;
      }
    }
    return nowString;
  }

  /**
   * @hidden
   */
  hasValue(): boolean {
    const val = this._value;
    return isPresent(val)
      && isObject(val)
      && Object.keys(val).length > 0;
  }

  /**
   * @hidden
   */
  calcMinMax(now?: Date) {
    const todaysYear = (now || new Date()).getFullYear();
    if (isPresent(this.yearValues)) {
      var years = convertToArrayOfNumbers(this.yearValues, 'year');
      if (isBlank(this.min)) {
        this.min = Math.min.apply(Math, years);
      }
      if (isBlank(this.max)) {
        this.max = Math.max.apply(Math, years);
      }
    } else {
      if (isBlank(this.min)) {
        this.min = (todaysYear - 100).toString();
      }
      if (isBlank(this.max)) {
        this.max = todaysYear.toString();
      }
    }
    const min = this._min = parseDate(this.min);
    const max = this._max = parseDate(this.max);

    min.year = min.year || todaysYear;
    max.year = max.year || todaysYear;

    min.month = min.month || 1;
    max.month = max.month || 12;
    min.day = min.day || 1;
    max.day = max.day || 31;
    min.hour = min.hour || 0;
    max.hour = max.hour || 23;
    min.minute = min.minute || 0;
    max.minute = max.minute || 59;
    min.second = min.second || 0;
    max.second = max.second || 59;

    // Ensure min/max constraits
    if (min.year > max.year) {
      console.error('min.year > max.year');
      min.year = max.year - 100;
    }
    if (min.year === max.year) {
      if (min.month > max.month) {
        console.error('min.month > max.month');
        min.month = 1;
      } else if (min.month === max.month && min.day > max.day) {
        console.error('min.day > max.day');
        min.day = 1;
      }
    }
  }

  ionViewDidLoad() {
    this.refresh();
  }

  refresh() {
    this._cols.forEach(column => column.refresh());
  }

  getSelected(): any {
    let selected: {[k: string]: any} = {};
    this.option.columns.forEach((col, index) => {
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
