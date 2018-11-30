import {EventEmitter, Injectable} from '@angular/core';
import {Calendar} from "@ionic-native/calendar";
import {Ha01Page} from "../pages/ha01/ha01";
import {RcEntity} from "../entity/rc.entity";
import {RcpEntity} from "../entity/rcp.entity";
import {UtilService} from "./util-service/util.service";
import {BaseSqliteService} from "./sqlite-service/base-sqlite.service";

/**
 * 页面ts传值(Calendar)
 * create by wzy on 2018/05/28.
 */
@Injectable()
export class CalendarService {

  private selectDay: EventEmitter<any> = new EventEmitter();

  public setSelectDay($event){
    this.selectDay.emit($event);
  }

  public getSelectDay(obj:Ha01Page){
    this.selectDay.subscribe(($event)=>{
      obj.findTodaySchedule($event);
    })
  }

  constructor(private calendar: Calendar,
              private util:UtilService,
              private baseSqlite:BaseSqliteService) { }

  /**
   * 查询本地日历所有日程
   * @returns {Promise<any>}
   */
  findEvent():Promise<any>{
    return new Promise((resolve, reject) => {
      this.calendar.findEvent("", "", "", new Date("1900-01-01"), new Date("2118-12-31")).then(
        (msg) => {
          alert(JSON.stringify(msg));
          resolve(msg);
        },
        (err) => {
          reject(err);
        }
      );
    })

  }

  //同步本地日历日程
  uploadLocal(){
    this.findEvent().then(msg=>{

      //alert(msg.rows.item(0).title);

      let data=eval(msg);
      // alert(data.length);
      // alert(data[0].title);
      // alert(JSON.stringify(data[0]));

      for(let i=0;i<data.length;i++) {
        let rc=new RcEntity();
        rc.sI=this.util.getUuid();
        rc.uI="";
        rc.sN=data[i].title;
        rc.lI="";
        rc.sd=data[i].startDate;
        rc.ed=data[i].endDate;

        let rcp=new RcpEntity();
        rcp.pI=this.util.getUuid();    //日程参与人表uuID
        rcp.sI=rc.sI; //关联日程UUID
        rcp.son="";  //日程别名
        rcp.sa="";   //修改权限
        rcp.ps="";   //完成状态
        rcp.cd=rc.sd;//创建时间
        rcp.pd="";   //完成时间
        rcp.uI=rc.uI; //参与人ID
        rcp.ib="1";

        this.baseSqlite.executeSql(rc.isq,
          [])
          .then(msg=>{
            //alert(rc.isq);
          })
          .catch(err=>{
            //alert("插入C表错误:"+err);
          });


        this.baseSqlite.executeSql(rcp.isq , [])
          .then(msg=>{
            //alert(rcp.isq);
          })
          .catch(err=>{
            //alert("插入D表错误:"+JSON.stringify(err));
          });;

      }
    }).catch(err=>{
      //alert("err");
      //alert(err);
    });
  }
}
