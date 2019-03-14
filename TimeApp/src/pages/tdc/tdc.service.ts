import {Injectable} from "@angular/core";
import {SqliteExec} from "../../service/util-service/sqlite.exec";

@Injectable()
export class TdcService {
  constructor(
    private sqlExce: SqliteExec) {
  }

  //保存日程
  save():Promise<any>{
    return new Promise((resolve, reject) => {

      //check 日程必输项

      //保存本地日程

      //保存本地提醒表

      //restFul保存日程

    });
  }

  //获取计划列表
  getPlans():Promise<any>{
    return new Promise((resolve, reject) => {

      //获取本地计划列表

    });
  }
}
