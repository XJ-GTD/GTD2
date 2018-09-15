import { Injectable } from '@angular/core';
import { UserModel} from "../model/user.model";
import { ScheduleModel } from "../model/schedule.model";
import { GroupModel } from "../model/group.model";
import {ScheduleOutModel} from "../model/out/schedule.out.model";

/**
 * 页面ts传值
 * create by wzy on 2018/05/28.
 */
@Injectable()
export class ParamsService {

  private _data: string;
  private _voice: any;
  private _speech: string;               //语音播报
  private _user: UserModel;               //用户数据
  private _schedule: ScheduleModel;       //日程数据
  private _scheduleList: Array<ScheduleModel>;  //数据list
  private _group: GroupModel;                //群组数据
  private _contactList: Array<number>;   //联系人数据
  private _findSchedule: ScheduleOutModel;    //查询日程

  get schedule(): ScheduleModel {
    return this._schedule;
  }

  set schedule(value: ScheduleModel) {
    this._schedule = value;
  }
  get voice(): any {
    return this._voice;
  }

  set voice(value: any) {
    this._voice = value;
  }
  get user(): UserModel {
    return this._user;
  }

  set user(value: UserModel) {
    this._user = value;
  }

  get data(): string {
    return this._data;
  }

  set data(value: string) {
    this._data = value;
  }

  get contactList(): Array<number> {
    return this._contactList;
  }

  set contactList(value: Array<number>) {
    this._contactList = value;
  }

  get group(): GroupModel {
    return this._group;
  }

  set group(value: GroupModel) {
    this._group = value;
  }

  get findSchedule(): ScheduleOutModel {
    return this._findSchedule;
  }

  set findSchedule(value: ScheduleOutModel) {
    this._findSchedule = value;
  }

  get scheduleList(): Array<ScheduleModel> {
    return this._scheduleList;
  }

  set scheduleList(value: Array<ScheduleModel>) {
    this._scheduleList = value;
  }

  get speech(): string {
    return this._speech;
  }

  set speech(value: string) {
    this._speech = value;
  }
}
