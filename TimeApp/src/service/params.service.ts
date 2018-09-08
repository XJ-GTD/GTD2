import { Injectable } from '@angular/core';
import { UserModel} from "../model/user.model";
import { ScheduleModel } from "../model/schedule.model";

/**
 * 页面ts传值
 * create by wzy on 2018/05/28.
 */
@Injectable()
export class ParamsService {

  private _data: string;
  private _user: UserModel;
  private _voice: any;
  private _schedule: ScheduleModel;
  private _contactList: Array<number>;

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

}
