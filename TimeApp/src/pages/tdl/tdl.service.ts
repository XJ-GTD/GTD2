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
  specScds: Map<string, SpecScdData> = new Map<string, SpecScdData>();

  //当天关联的特殊日程
  specScd(): SpecScdData {
    return this.specScds.get(this.sd);
  }

  //参与人
  fss: Array<fsData> =new Array<fsData>();

  //发起人
  fs: fsData =new fsData();


  //提醒设置
  r: RemindData = new RemindData();

  //所属计划
  p:PlData = new PlData();


}


//特殊事件
export class SpecScdData {
  spi: string = "" //日程特殊事件ID
  si: string = ""//日程事件ID
  spn: string = ""//日程特殊事件主题
  sd: string = ""//开始日期
  st: string = ""//开始时间
  ed: string = ""//结束时间
  et: string = ""//结束时间
  ji: string = ""//计划ID
  bz: string = ""//备注
  sta: string = ""//特殊类型
  tx: string = ""//提醒方式
  wtt: number;//时间戳

}

//参与人
export class fsData {
  pwi: string = ""; //主键
  ran: string = ""; //联系人别称
  ranpy: string = ""; //联系人别称拼音
  hiu: string = "";  // 联系人头像
  rn: string = "";  // 联系人名称
  rnpy: string = "";  //联系人名称拼音
  rc: string = "";  //联系人联系方式
  rel: string = ""; //系类型 1是个人，2是群，0未注册用户
  ui: string = "";  //数据归属人ID

}


//提醒时间
export class RemindData {
  wi: string = "";//提醒时间ID
  si: string = "";//日程事件ID
  st: string = ""; //日程事件类型
  wd: string = "";//日程提醒日期
  wt: string = "";//日程提醒时间
  wtt: number;//创建时间戳
}
//计划
export class PlData{
  ji: string="";//计划ID
  jn: string="";//计划名
  jg: string="";//计划描述
  jc: string="";//计划颜色标记
  jt: string="";//计划类型
}



