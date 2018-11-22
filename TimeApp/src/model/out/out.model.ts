/**
 * create by on 2018/11/19
 */

//用户类
export class RuoModel {

  /**
   * 数量
   */
  private _ct:number;
  private _us: Array<any>;                 //参与人

  get ct(): number {
    return this._ct;
  }

  set ct(value: number) {
    this._ct = value;
  }

  get us(): Array<any> {
    return this._us;
  }

  set us(value: Array<any>) {
    this._us = value;
  }
}
