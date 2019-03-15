import {Injectable} from "@angular/core";
import {SqliteExec} from "../../service/util-service/sqlite.exec";
import {BsModel} from "../../service/restful/out/bs.model";
import {CTbl} from "../../service/sqlite/tbl/c.tbl";
import {ETbl} from "../../service/sqlite/tbl/e.tbl";
import {UtilService} from "../../service/util-service/util.service";
import {AgdPro, AgdRestful} from "../../service/restful/agdsev";
import {SpTbl} from "../../service/sqlite/tbl/sp.tbl";

import * as moment from "moment";

@Injectable()
export class TdcService {
  constructor(private sqlExce: SqliteExec,private util: UtilService,private agdRest: AgdRestful) {
  }

  /**
   * 日程添加
   * @param {PageRcData} rc 日程信息
   * @returns {Promise<BsModel<any>>}
   */
  save(rc : PageRcData):Promise<BsModel<any>>{
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
          et.wi = this.util.getUuid();
          et.wt = '0';
          et.wd=rc.sd;
          et.st = rc.st;
          //保存本地提醒表
          return this.sqlExce.save(et);
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
          bs = data;
          resolve(bs);
        }).catch(e=>{
          bs.code = -99;
          bs.message = e.message;
          resolve(bs);
        })
      }
    });
  }

  /**
   * 添加特殊日程表（更新非重复类型的）
   * @param {PageRcData} rc 日程信息
   * @param {string} flag 1：修改，2：删除
   * @returns {Promise<BsModel<any>>}
   */
  savesp(rc : PageRcData,flag:string):Promise<BsModel<any>>{
    return new Promise((resolve, reject) => {
      let bs = new BsModel<any>();
      let str =this.checkRc(rc);
      if(str != ''){
        bs.code = 1;
        bs.message = str;
        resolve(bs);
      }else{
        let ct = new SpTbl();
        Object.assign(ct,rc);
        ct.spi = this.util.getUuid();
        ct.ed = ct.sd;
        ct.et = ct.st;
        ct.sta = flag;
        ct.spn = rc.sn;
        let et = new ETbl();//提醒表
        et.si = rc.si;
        //保存本地日程
        this.sqlExce.replaceT(ct).then(data=>{
          //先删除提醒表
          return this.sqlExce.delete(et);
        }).then(data=>{
          et.wi = this.util.getUuid();
          et.wt = '1';
          et.wd=rc.sd;
          et.st = rc.st;
          //保存本地提醒表
          return this.sqlExce.save(et);
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
          bs = data;
          resolve(bs);
        }).catch(e=>{
          bs.code = -99;
          bs.message = e.message;
          resolve(bs);
        })
      }
    });
  }

  /**
   * 重复类型日程更新/删除 以后的日程
   * @param {PageRcData} rc 日程信息
   * @param {string} flag 1：修改，2：删除
   * @returns {Promise<BsModel<any>>}
   */
  upOrdelrp(rc:PageRcData,flag:string):Promise<BsModel<any>>{
    return new Promise((resolve, reject) => {
      let bs = new BsModel<any>();
      let str =this.checkRc(rc);
      if(str != ''){
        bs.code = 1;
        bs.message = str;
        resolve(bs);
      }else{
        let nowSd = moment(new Date(rc.sd).getTime() - 24*60*60*1000).format("YYYY/MM/DD");
        let ct = new CTbl();
        ct.si = rc.si;
        ct.ed = nowSd;
        let et = new ETbl();//提醒表
        et.si = rc.si;
        //更新原日程结束日期
        this.sqlExce.update(ct).then(data=>{
          if(flag == '1'){
            Object.assign(ct,rc);
            ct.si = this.util.getUuid();
            ct.pni = rc.si;
            //保存新日程
            return this.sqlExce.save(ct);
          }
        }).then(data=>{
          if(flag == '1'){
            et.wi = this.util.getUuid();
            et.wt = '1';
            et.wd=rc.sd;
            et.st = rc.st;
            //保存本地提醒表
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
          adgPro.pni = ct.si;
          //restFul保存日程
          return this.agdRest.save(adgPro)
        }).then(data=>{
          bs = data;
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
  checkRc(rc:PageRcData):string{
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

}

export class PageRcData {
  si: string="";  //日程事件ID
  sn: string="";  //日程事件主题
  ui: string="";  //创建者
  sd: string="";  //开始日期
  st: string="";  //开始时间
  ed: string="";  //结束日期
  et: string="";  //结束时间
  rt: string="";  //重复类型
  ji: string="";  //计划ID
  sr: string ="";  //日程关联ID
  bz: string ="";  //备注
  tx: string ="";  //提醒方式
  lxrL:Array<PageLxrData> = new Array<PageLxrData>(); //日程参与人
}

export class PageLxrData{
  pi: string=""; //日程参与人表ID
  si: string=""; //日程事件ID
  pwi: string=""; //联系人主键
  ran: string=""; //别称
  ranpy: string=""; //联系人别称拼音
  hiu: string="";  // 联系人头像
  rn: string="";  // 联系人名称
  rnpy: string="";  //联系人名称拼音
  rc: string="";  //联系人联系方式
  ui: string="";  //数据归属人ID
}
