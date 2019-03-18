import {Injectable} from "@angular/core";
import {SqliteExec} from "../../service/util-service/sqlite.exec";
import {UserConfig} from "../../service/config/user.config";
import {BsModel} from "../../service/restful/out/bs.model";
import * as moment from "moment";

@Injectable()
export class TdlService {
  constructor(
    private sqlExce: SqliteExec,
    private userConfig: UserConfig) {
  }

  //获取日程 （每次返回30条数据，下拉返回日期之前，上推返回日期之后）
  async get(next:string){
    if(next != null && next !=""){
      let mp:Map<string,any> = new Map<string,any>();
      //获取本地日程jn jg jc jt
      let sqll="select gc.*,jh.jn,jh.jg,jh.jc,jh.jt from gtd_c gc inner join gtd_j_h jh on jh.ji = gc.ji  " +
        "where gc.sd<'"+ next+"'  or gd.ed is null or gd.ed >='"+next+"'order by gc.ed desc";
      let rclL = await this.sqlExce.execSql(sqll);
      if(rclL && rclL.rows && rclL.rows.length>0){
        let len = rclL.rows.length-1;
        let i=0;
        let d=0;
        //循环获取30条数据
        while(i>30 || i==len){
          let day = moment(new Date(next).getTime() - d*60*60*100).format("YYYY/MM/DD");
          let dcL = new Array<ScdData>();
          for(let j=0;j<100;j++){
            let sc:ScdData = rclL.rows.item(j);
            if(sc.sd>day){
              break;
            }else if(this.isymwd(sc.rt,day,sc.sd,sc.ed)){
              dcL.push(sc);
              i++;
            }
          }
          d++;
          mp.set(day,dcL);
        }
      }

      //正序查出比当前日期大的日程
      let sql="select gc.*,jh.jn,jh.jg,jh.jc,jh.jt from gtd_c gc inner join gtd_j_h jh on jh.ji = gc.ji " +
        "where gc.ed<='"+ next+"' or gc.ed is null order by gc.ed asc";
      let rcnL = await this.sqlExce.execSql(sql);

      if(rcnL && rcnL.rows && rcnL.rows.length>0){
        let len = rcnL.rows.length-1;
        let i=0;
        let d=0;
        //循环获取60条数据
        while(i>60 || i==len){
          let day = moment(new Date(next).getTime() + d*60*60*100).format("YYYY/MM/DD");
          let dcL = new Array<ScdData>();
          for(let j=0;j<100;j++){
            let sc:ScdData = rcnL.rows.item(j);
            if(sc.sd>day){
              break;
            }else if(this.isymwd(sc.rt,day,sc.sd,sc.ed)){
              dcL.push(sc);
              i++;
            }
          }
          d++;
          mp.set(day,dcL);
        }
      }

    }

      //获取日程对应参与人或发起人

      //获取计划对应色标

  }

  /**
   * 查询当天的日程
   * @param {string} day  YYYY/MM/DD
   * @returns {Promise<BsModel<any>>}
   */
  getOneDayRc(day:string):Promise<BsModel<any>>{
    return new Promise((resolve, reject) => {
      let sql = 'select si ,sn ,ui ,sd ,st ,ed ,et ,rt ,ji,sr,tx from gtd_c gc  ' +
        'where (gc.sd <="' + day +'" and gc.ed is null ) or (gc.sd <="' + day +'" and gc.ed>='+day+'")';
      let bs = new BsModel<Array<ScdData>>();
      this.sqlExce.execSql(sql).then(data=>{
        if(data && data.rows && data.rows.length>0){
          let spl = new Array<ScdData>();
          for(let i=0,len=data.rows.length;i<len;i++){
            let sp:ScdData = data.rows.item(i);
            if(this.isymwd(sp.rt,day,sp.sd,sp.ed)){
              spl.push(sp);
            }
          }
          bs.data = spl;
        }
        resolve(bs);
      }).catch(e=>{
        bs.code = -99;
        bs.message = e.message;
        resolve(bs);
      })
    })
  }

  /**
   * 判断当前日期是否对应重复类型
   * @param {string} cft 重复类型
   * @param {string} day 当前日期
   * @param {string} sd 开始日期
   * @param {string} ed 结束日期
   * @returns {boolean}
   */
  isymwd(cft:string,day:string,sd:string,ed:string):boolean{
    let isTrue = false;
    if(ed == '' || ed == null){
      ed = null;
    }
    if(cft && cft != null && cft !='undefined'){
      if(cft=='1'){//年
        sd = sd.substr(4,6);
        if(sd == day.substr(4,6)){
          isTrue = true;
        }
      }else if(cft=='2'){ //月
        sd = sd.substr(8,2);
        if(sd<= day && sd== day.substr(8,2) && day<=ed){
          isTrue = true;
        }
      }else if(cft=='3'){ //周
        let sdz = new Date(sd).getDay();
        let dayz = new Date(day).getDay();
        if(sd<=day && sdz == dayz  && day<=ed){
          isTrue = true;
        }
      }else if(cft=='4'){ //日
        if(sd<=day && ed>=day){
          isTrue = true;
        }
      }
    }else if(sd<=day && ed>=day){
      isTrue = true;
    }
    return isTrue;
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
  pni:string = "";//日程原始ID
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



