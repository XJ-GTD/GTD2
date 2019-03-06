/**
 * create by on 2018/11/19
 */

import {BsModel} from "./bs.model";
import {RcpModel} from "../rcp.model";
import {ScheduleModel} from "../schedule.model";
import {RcModel} from "../rc.model";

//用户类
export class RcoModel extends BsModel{

  /**
   * 数量
   */
  private _rcL: Array<RcModel> ; //事件list

  get rcL(): Array<RcModel> {
    return this._rcL;
  }

  set rcL(value: Array<RcModel>) {
    this._rcL = value;
  }
}
