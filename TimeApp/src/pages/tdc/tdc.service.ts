import {Injectable} from "@angular/core";
import {SqliteExec} from "../../service/util-service/sqlite.exec";
import {BsModel} from "../../service/restful/out/bs.model";
import {CTbl} from "../../service/sqlite/tbl/c.tbl";
import {ETbl} from "../../service/sqlite/tbl/e.tbl";
import {UtilService} from "../../service/util-service/util.service";
import {AgdPro, AgdRestful} from "../../service/restful/agdsev";
import {SpTbl} from "../../service/sqlite/tbl/sp.tbl";

import * as moment from "moment";
import {ScdData, SpecScdData} from "../tdl/tdl.service";

@Injectable()
export class TdcService {
  constructor(private sqlExce: SqliteExec,private util: UtilService,private agdRest: AgdRestful) {
  }

  /**
   * 日程添加
   * @param {PageRcData} rc 日程信息
   * @returns {Promise<BsModel<any>>}
   */
  save(rc : ScdData):Promise<BsModel<any>>{
    return new Promise((resolve, reject) => {
      let bs = new BsModel<any>();
      let str =this.checkRc(rc);
      if(str != ''){
        bs.code = 1;
        bs.message = str;
        resolve(bs);
      }else{
        let ct = new CTbl();
        Object.assign(ct,rc);
        rc.si = this.util.getUuid();
        let et = new ETbl();//提醒表
        et.si = rc.si;
        //保存本地日程
        this.sqlExce.save(ct).then(data=>{
          let len = 1;
          if(rc.rt=='1'){
            len = 80;
          }else if(rc.rt=='2'){
            len = 24;
          }else if(rc.rt=='3'){
            len = 96;
          }else if(rc.rt=='4'){
            len = 365;
          }
          let sql=new Array<string>();
          for(let i=0;i<len;i++){
            let sp = new SpTbl();
            sp.spi = this.util.getUuid();
            sp.si = rc.si;
            sp.sd = moment(rc.sd).add(i,'d').format("YYYY/MM/DD");
            sp.st = rc.st;
            sql.push(sp.inT());
          }
          if(sql.length>0){
            console.log('-------- 插入重复表 --------');
            //保存特殊表
            return this.sqlExce.batExecSql(sql);
          }
        }).then(data=>{
          //保存本地提醒表
          if(rc.tx != '0'){
            et.wi = this.util.getUuid();
            et.wt = '0';
            let time = 10; //分钟
            if(rc.tx == "2"){
              time = 30;
            }else if(rc.tx == "3"){
              time = 60;
            }else if(rc.tx == "4"){
              time = 240;
            }else if(rc.tx == "5"){
              time = 360;
            }
            let date = moment(rc.sd+ " " + rc.st).add(time,'m').format("YYYY/MM/DD mm:ss");
            et.wd=date.substr(0,10);
            et.st = date.substr(11,5);
            return this.sqlExce.save(et);
          }

        }).then(data=>{
          let adgPro:AgdPro = new AgdPro();
          adgPro.ai=rc.si; //日程ID
          adgPro.rai=rc.sr;//日程发送人用户ID
          adgPro.fc=rc.ui; //创建人
          adgPro.at=rc.sn;//主题
          adgPro.adt=rc.sd + " " + rc.st; //时间(YYYY/MM/DD HH:mm)
          adgPro.ap=rc.ji;//计划
          adgPro.ar=rc.rt;//重复
          adgPro.aa=rc.tx;//提醒
          adgPro.am=rc.bz;//备注
          //restFul保存日程
          return this.agdRest.save(adgPro)
        }).then(data=>{
          bs.data=ct;
          resolve(bs);
        }).catch(e=>{
          bs.code = -99;
          bs.message = e.message;
          resolve(bs);
        })
      }
    });
  }

  //获取计划列表
  getPlans():Promise<any>{
    return new Promise((resolve, reject) => {

      //获取本地计划列表

    });
  }

  /**
   * 日程校验
   * @param {PageRcData} rc
   * @returns {string}
   */
  checkRc(rc:ScdData):string{
    let str = '';
    //check 日程必输项
    if(rc.sn == ''){
      str += '标题不能为空;/n';
    }
    if(rc.sn.length>20){
      str += '标题文本长度必须下于20;/n';
    }
    if(rc.sd == ''){
      str += '日期不能为空;/n';
    }
    return str;
  }

  /**
   * 查询当天的日程
   * @param {string} day  YYYY/MM/DD
   * @returns {Promise<BsModel<any>>}
   */
  getOneDayRc(day:string):Promise<BsModel<any>>{
    return new Promise((resolve, reject) => {
      let sql = 'select gc.* from gtd_c gc  ' +
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
