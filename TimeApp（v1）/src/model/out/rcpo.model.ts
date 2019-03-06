/**
 * create by on 2018/11/19
 */

import {BsModel} from "./bs.model";
import {RcpModel} from "../rcp.model";
import {ScheduleModel} from "../schedule.model";

//用户类
export class RcpoModel extends BsModel{

  /**
   * 数量
   */
  private _ct:number;//事件数量
  private _sjl: Array<RcpModel> ; //事件list
  private _sj: RcpModel; //事件
  private _slc: Array<ScheduleModel> ; //事件list
  get ct(): number {
    return this._ct;
  }

  set ct(value: number) {
    this._ct = value;
  }

  get sjl(): Array<RcpModel> {
    return this._sjl;
  }

  set sjl(value: Array<RcpModel>) {
    this._sjl = value;
  }

  get sj(): RcpModel {
    return this._sj;
  }

  set sj(value: RcpModel) {
    this._sj = value;
  }

  get slc(): Array<ScheduleModel> {
    return this._slc;
  }

  set slc(value: Array<ScheduleModel>) {
    this._slc = value;
  }
}
