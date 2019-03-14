import {Injectable} from "@angular/core";
import {SqliteExec} from "../../service/util-service/sqlite.exec";
import {UserConfig} from "../../service/config/user.config";

@Injectable()
export class TdlService {
  constructor(
    private sqlExce: SqliteExec,
    private userConfig: UserConfig) {
  }

  //获取日程 （每次返回30条数据，下拉返回日期之前，上推返回日期之后）
  get(): Promise<any> {
    return new Promise((resolve, reject) => {

      //获取本地日程

      //获取日程对应参与人或发起人

      //获取计划对应色标
    });
  }
}

export class ScdData {
  si: string = "";//日程事件ID
  sn: string = "";//日程事件主题
  ui: string = "";//创建者
  sd: string = "";//开始日期
  st: string = "";//开始时间
  ed: string = "";//结束日期
  et: string = "";//结束时间
  rt: string = "";//重复类型
  ji: string = "";//计划ID
  sr: string = "";//日程关联ID
  bz: string = "";//备注
  tx: string = "";//提醒方式
  wtt: number;//时间戳


  //特殊日期日程
  specScds: Map<string,SpecScd> = new Map<string, SpecScd>();

  //当天关联的特殊日程
  specScd(): SpecScd{
    return this.specScds.get(this.sd);
  }

  //参与人
  //fs: Array<>

  //发起人


  //提醒设置

  //所属计划

}


export class SpecScd{
  spi:string="" //日程特殊事件ID
  si:string=""//日程事件ID
  spn:string=""//日程特殊事件主题
  sd:string=""//开始日期
  st:string=""//开始时间
  ed:string=""//结束时间
  et:string=""//结束时间
  ji:string=""//计划ID
  bz:string=""//备注
  sta:string=""//特殊类型
  tx:string=""//提醒方式
  wtt: number;//时间戳

}


