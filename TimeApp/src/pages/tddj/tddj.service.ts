import {Injectable} from "@angular/core";
import {SqliteExec} from "../../service/util-service/sqlite.exec";
import {UserConfig} from "../../service/config/user.config";

@Injectable()
export class TddjService {
  constructor(
    private sqlExce: SqliteExec,
    private userConfig:UserConfig) {
  }

  //获取日程
  get():Promise<any>{
    return new Promise((resolve, reject) => {
      //获取本地日程

      //获取计划对应色标

    });
  }

  //删除日程
  delete():Promise<any>{
    return new Promise((resolve, reject) => {

      //删除本地日程

      //restFul删除日程

    });
  }

  //修改本地日程
  update():Promise<any>{
    return new Promise((resolve, reject) => {

      //修改本地本地日程

      //删除本地提醒表

      //插入本地提醒表

      //restFul修改日程

    });
  }


  //获取计划列表
  getPlans():Promise<any>{
    return new Promise((resolve, reject) => {

      //获取本地计划列表

    });
  }
}
