import { Injectable } from '@angular/core';
import { UserModel} from "../model/user.model";
import { ScheduleModel } from "../model/schedule.model";
import { GroupModel } from "../model/group.model";
import {ScheduleOutModel} from "../model/out/schedule.out.model";
import {AiuiModel} from "../model/aiui.model";

/**
 * 页面ts传值
 * create by wzy on 2018/05/28.
 */
@Injectable()
export class ParamsService {

  private _data: string;

  private _aiuiData: AiuiModel;            //语音解析返回数据
  private _speech: string;               //语音播报

  private _user: UserModel;               //用户数据

  private _schedule: ScheduleModel;       //日程数据
  private _scheduleList: Array<ScheduleModel>;  //日程数据list
  private _findSchedule: ScheduleOutModel;    //查询日程

  private _group: GroupModel;                //群组数据
  private _groupType: string;    //判断是群组：group / 个人：person

  private _contactList: Array<number>;   //联系人数据


  get schedule(): ScheduleModel {
    return this._schedule;
  }

  set schedule(value: ScheduleModel) {
    this._schedule = value;
  }

  get user(): UserModel {
    return this._user;
  }

  set user(value: UserModel) {
    this._user = value;
  }

  get aiuiData(): AiuiModel {
    return this._aiuiData;
  }

  set aiuiData(value: AiuiModel) {
    this._aiuiData = value;
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

  get groupType(): string {
    return this._groupType;
  }

  set groupType(value: string) {
    this._groupType = value;
  }
}
