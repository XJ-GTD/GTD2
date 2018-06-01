import { Injectable } from '@angular/core';
import { User } from "../model/user.model";

/**
 * 页面ts传值
 * create by wzy on 2018/05/28.
 */
@Injectable()
export class ParamsService {
  get user(): User {
    return this._user;
  }

  set user(value: User) {
    this._user = value;
  }

  get data(): string {
    return this._data;
  }

  set data(value: string) {
    this._data = value;
  }

  private _data: string;
  private _user: User;

}
