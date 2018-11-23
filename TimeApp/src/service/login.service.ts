import { Injectable } from '@angular/core';
import {RemindSqliteService} from "./sqlite-service/remind-sqlite.service";
import {BaseModel} from "../model/base.model";


/**
 * 闹铃
 */
@Injectable()
export class LoginService {

  constructor(private remindSqlite: RemindSqliteService) {

  }
  login():Promise<BaseModel>{
    return new Promise((resolve, reject) =>{
      let base = new BaseModel();
      resolve(base)
    })
  }
}
