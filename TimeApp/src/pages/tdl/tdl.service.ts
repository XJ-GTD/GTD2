import {Injectable} from "@angular/core";
import {SqliteExec} from "../../service/util-service/sqlite.exec";
import {UserConfig} from "../../service/config/user.config";

@Injectable()
export class TdlService {
  constructor(
    private sqlExce: SqliteExec,
    private userConfig:UserConfig) {
  }

  //获取日程 （每次返回30条数据，下拉返回日期之前，上推返回日期之后）
  get():Promise<any>{
    return new Promise((resolve, reject) => {

      //获取本地日程

      //获取日程对应参与人或发起人

      //获取计划对应色标
    });
  }
}
