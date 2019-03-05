import { EventEmitter, Injectable } from '@angular/core';
import { Calendar } from "@ionic-native/calendar";
import { TdlPage } from "../pages/tdl/tdl";
import { UtilService } from "./util-service/util.service";
import { BaseSqlite } from "./sqlite/base-sqlite";
import { PlayerService } from "./player.service";
import { BsModel } from "../model/out/bs.model";
import { UserService } from "./user.service";
import { RcEntity } from "../entity/rc.entity";
import { RcpEntity } from "../entity/rcp.entity";
import { PlayerSqlite } from "./sqlite/player-sqlite";
import { DataConfig } from "../app/data.config";
import {ReturnConfig} from "../app/return.config";
import {RcModel} from "../model/rc.model";
import {RcoModel} from "../model/out/rco.model";

/**
 * 页面ts传值(Calendar)
 * create by wzy on 2018/05/28.
 */
@Injectable()
export class ReadlocalService {

  constructor(private calendar: Calendar,
              private util:UtilService,
              private baseSqlite:BaseSqlite,
              private userService:UserService,
              private playService:PlayerService,
              private playSqlite:PlayerSqlite  ) { }
  /**
   * 查询本地日历所有日程
   * @returns {Promise<any>}
   */
  findEvent():Promise<any>{
    return new Promise((resolve, reject) => {
      console.log("执行查询本地日历")
      this.calendar.findEvent("", "", "", new Date("2000-01-01"), new Date()).then(
        (msg) => {
          console.log("执行查询本地日历结束 data :: " + JSON.stringify(msg));
          console.log("getCalendarOptions::"+ JSON.stringify(this.calendar.getCalendarOptions()));
          resolve(msg);
        },
        (err) => {
          console.log("执行查询本地日历结束 err ::" + JSON.stringify(err));
          reject(err);
        }
      );
    })

  }

  /**
   * 查询本地日历所有日程
   * @returns {Promise<any>}
   */
  findEventRc(tit:string,sd:Date,ed:Date,rcL:Array<RcModel>):Promise<RcoModel>{
    return new Promise((resolve, reject) => {
      console.log("执行查询本地日历");
      let rco = new RcoModel();
      rco.rcL=rcL;
      let locals = new Array<RcModel>();
      //从sqlite中获取已存在的本地日历信息
      if(rcL.length>0){
        for(let rcc of rcL){
          if(rcc.bi && rcc.bi != null && rcc.bi != ''){
            locals.push(rcc);
          }
        }
      }
      if(DataConfig.IS_MOBILE){
        console.log("查询本地日历开始时间："+ sd+ ",结束时间:"+ed);
        this.calendar.findEvent(tit, "", "", sd, ed).then(
          (msg) => {
            console.log("执行查询本地日历结束 data :: " + JSON.stringify(msg));
            console.log("getCalendarOptions::"+ JSON.stringify(this.calendar.getCalendarOptions()));
            if(msg.length>0){
              for(let i=0;i<msg.length;i++) {
                let isTrue = true;
                //过滤已存在sqlite的本地日历
                for(let data of locals){
                  if(data.bi == msg[i].id){
                    isTrue = false;
                    break;
                  }
                }
                if(isTrue){

                  let rc = new RcModel();
                  rc.uI = DataConfig.uInfo.uI;
                  rc.sN=msg[i].title;
                  console.log("查询本地日历是否全天："+ msg[i].allday);
                  if(msg[i].allday){
                    rc.sd=msg[i].startDate.substr(0,10) + " " + "00:00";
                    rc.ed=msg[i].startDate.substr(0,10) + " " + "23:59";
                  }else{
                    rc.sd=msg[i].startDate;
                    rc.ed=msg[i].endDate;
                  }
                  console.log("查询本地日历开始时间："+ rc.sd+ ",结束时间:"+rc.ed);
                  console.log("执行查询本地日历结束 data :: " + JSON.stringify(msg[i]));
                  rc.bi=msg[i].id;
                  rc.ib='1';
                  rcL.push(rc);
                }

              }
              rco.rcL=rcL;
            }
            resolve(rco);
          },
          (err) => {
            console.log("执行查询本地日历结束 err ::" + JSON.stringify(err));
            rco.code = ReturnConfig.ERR_CODE;
            rco.message=err.toString();
            reject(err);
          });
      }else{
        resolve(rco);
      }
    })

  }


  /**
   * 同步本地日历入库
   * @returns {Promise<BsModel>}
   */
  uploadLocal():Promise<BsModel>{
    return new Promise((resolve,reject)=>{
      let model = new BsModel();
      if(DataConfig.IS_MOBILE){
        let uI = '';
        uI = DataConfig.uInfo.uI;
        this.findEvent().then(data=>{
          console.log("calendarService ::"+"查询本地日历成功");
          //this.findEvent返回msg
          let arr = [];
          for(let i=0;i<data.length;i++) {
            //判断是否存在 rcp 与 rc
            //逻辑 查rcp 查rc 改rc 改 rcp
            arr.push(this.checkInfo(uI,data[i].id,data[i].title,data[i].startDate,data[i].endDate));
          }
          return Promise.all(arr);
        }).then(data=>{
          console.log("calendarService ::"+"导入本地日历成功");
          console.log("calendarService ::" + JSON.stringify(data));
          resolve(model);
        }).catch(err => {
          console.error("calendarService ::"+"导入本地日历失败");
          model.code = 1;
          model.message = "失败";
          reject(model);
        })
      }else{
        resolve(model);
      }
    })

  }

  checkInfo(uI:string,bi:string,title:string,startDate:string,endDate:string):Promise<any>{
    return new Promise((resolve ,reject)=>{
      let rc = new RcEntity();
      console.log("rcEntity::"+JSON.stringify(rc));
      rc.uI = uI;
      let rcp = new RcpEntity();
      console.log("rcpEntity::"+JSON.stringify(rcp));
      rcp.bi = bi;
      rcp.uI = uI;
      rcp.ib = "1";
      let bs = new BsModel();
      this.playSqlite.getRcp(rcp).then(data1=>{
        if( data1.rows &&  data1.rows.length > 0) {
          let tmp:RcpEntity = data1.rows.item(0);
          console.log("查询rcp :: " + JSON.stringify(tmp));
          rc.sI = tmp.sI;
          rcp.sI = tmp.sI;
          rcp.uI = tmp.uI;
          rcp.pI = tmp.pI;
          rcp.ps = tmp.ps;
          rcp.pd = tmp.pd;
          rcp.bi = tmp.bi;
          rcp.ib = tmp.ib;
          rcp.cd = tmp.cd;
          rcp.rui = tmp.rui;
          rcp.sa = tmp.sa;
          rcp.son = tmp.son;
          return this.updatePlayer(rc,rcp,title,startDate,endDate);
        }else{
          rc.sI = this.util.getUuid();
          rc.sN = title;
          rc.sd = startDate;
          rc.ed = endDate;
          rcp.pI = this.util.getUuid();
          rcp.sI = rc.sI;
          rcp.son = title;
          rcp.cd = startDate;
          return this.addPlayer(rc,rcp,title,startDate,endDate);
        }
      }).then(data2=>{
        //添加或更新后
        resolve(bs);

      }).catch(reason => {
        console.error("calendar checkInfo 添加本地日历 rcp Error ::"+ JSON.stringify(reason));
        bs.message = ReturnConfig.ERR_MESSAGE;
        bs.code = ReturnConfig.ERR_CODE;
        reject(bs);
      })




      // this.playService.getPlayer(null,null,null,uI,null,null,null,null,null,null,null,null,null,"1",bi).then(data=>{
      //   console.log("::"+JSON.stringify(data))
      //   let rcps = [];
      //   if(data.code == 0){
      //     rcps = data.rcps;
      //     if( rcps && rcps.length > 0){
      //       //存在相同的数据
      //       console.log("存在相同的数据 :: "+ JSON.stringify(rcps));
      //       let rcp:RcpEntity = rcps[0];
      //       return this.playService.updatePlayer(rcp.sI,title,"",uI,startDate,endDate,rcp.pI,
      //         title,rcp.sa,rcp.ps,startDate,rcp.pd,uI,"1",bi);
      //     }else{
      //       console.log("不存在相同的数据 :: "+ JSON.stringify(rcps));
      //       return this.playService.addPlayer(this.util.getUuid(),title,"",uI,startDate,endDate,this.util.getUuid(),
      //         title,"","",startDate,"",uI,"1",bi);
      //     }
      //   }
      //
      // }).then(data=>{
      //   console.log(JSON.stringify(data));
      //   if(data.code == 0){
      //     resolve(data)
      //   }else{
      //     reject(data)
      //   }
      // }).catch(reason => {
      //   console.log(JSON.stringify(reason));
      //   reject(reason)
      // })
    })
  }


  addPlayer(rc:RcEntity,rcp:RcpEntity,title:string,startDate:string,endDate:string):Promise<any>{
    return new Promise((resolve,reject)=>{
      let bs = new BsModel();
      this.playSqlite.addRc(rc).then(data1=>{
        console.log("calendar 添加本地日历 rc ::"+ JSON.stringify(rc));
        return this.playSqlite.addRcp(rcp);
      }).then(data2=>{
        console.log("calendar 添加本地日历 rcp ::"+ JSON.stringify(rcp));
        resolve(bs);
      }).catch(reason => {
        console.error("calendar addPlayer 添加本地日历 rcp Error ::"+ JSON.stringify(reason));
        bs.code = ReturnConfig.ERR_CODE;
        bs.message = reason.message;
        reject(bs);
      })
    })
  }

  updatePlayer(rc:RcEntity,rcp:RcpEntity,title:string,startDate:string,endDate:string):Promise<any>{
    return new Promise((resolve,reject)=>{
      let bs =new BsModel();
      this.playSqlite.getRc(rc).then(data2=>{
        let tmp:RcEntity = data2.rows.item(0);
        console.log("查询rc :: " + JSON.stringify(tmp));
        rc.sN = title;
        rc.sd = startDate;
        rc.ed = endDate;
        rc.lI = tmp.lI;
        rc.ji = tmp.ji;
        console.log("更新rc前 :: " + JSON.stringify(rc));
        return this.playSqlite.updateRc(rc);
      }).then(data3=>{
        console.log("更新rc :: " + JSON.stringify(rc));
        rcp.son = title;
        rcp.cd = startDate;
        console.log("更新rcp前 :: " + JSON.stringify(rcp));
        return this.playSqlite.updateRcp(rcp);
      }).then(data4=>{
        console.log("更新rcp :: " + JSON.stringify(rcp));
        resolve(bs);
      }).catch(reason => {
        console.error("calendar updatePlayer 更新本地日历 rcp Error ::"+ JSON.stringify(reason));
        bs.code = ReturnConfig.ERR_CODE;
        bs.message = reason.message;
        reject(bs);
      })

    })
  }

}
