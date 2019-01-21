/**
 * 闹钟类
 *
 * create by wzy on 2019/01/21
 */
import {AlarmDataModel} from "./alarm.data.model";

export class AlarmModel {

  private _alarms: Array<AlarmDataModel>;    //闹钟设置

  get alarms(): Array<AlarmDataModel> {
    return this._alarms;
  }

  set alarms(value: Array<AlarmDataModel>) {
    this._alarms = value;
  }
}
