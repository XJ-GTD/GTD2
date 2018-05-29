import { Injectable } from '@angular/core';

/**
 * 页面ts传值
 * create by wzy on 2018/05/28.
 */
@Injectable()
export class ParamsService {
  get data(): string {
    return this._data;
  }

  set data(value: string) {
    this._data = value;
  }
  private _data: string;


}
