import {Injectable} from "@angular/core";
import {WorkSqlite} from "./sqlite/work-sqlite";
import {MbsoModel} from "../model/out/mbso.model";
import {MbsModel} from "../model/mbs.model";
import {RcpoModel} from "../model/out/rcpo.model";
import {RcpModel} from "../model/rcp.model";
import {BsModel} from "../model/out/bs.model";
import {RuModel} from "../model/ru.model";
import {RcEntity} from "../entity/rc.entity";
import {BaseSqlite} from "./sqlite/base-sqlite";
import {UtilService} from "./util-service/util.service";
import {RcModel} from "../model/rc.model";
import {LbSqlite} from "./sqlite/lb-sqlite";
import {LboModel} from "../model/out/lbo.model";
import {LbModel} from "../model/lb.model";
import {ScheduleModel} from "../model/schedule.model";
import {MsEntity} from "../entity/ms.entity";
import {DataConfig} from "../app/data.config";
import {PsModel} from "../model/ps.model";
import {RcRestful} from "./restful/rc-restful";
import {SkillConfig} from "../app/skill.config";
import {RelmemSqlite} from "./sqlite/relmem-sqlite";
import {RcpEntity} from "../entity/rcp.entity";
import {ReturnConfig} from "../app/return.config";
import {RcoModel} from "../model/out/rco.model";
import * as moment from "moment";
import {MsSqlite} from "./sqlite/ms-sqlite";
import {ReadlocalService} from "./readlocal.service";
import {SyncSqlite} from "./sqlite/sync-sqlite";
import {SyncService} from "./sync.service";

/**
 * 日程逻辑处理
 *
 * create by wzy on 2018/11/09
 */
@Injectable()
export class WorkService {

  constructor(private baseSqlite : BaseSqlite,
                private util : UtilService,
                private workSqlite : WorkSqlite,
                private relmem : RelmemSqlite,
                private lbSqlite : LbSqlite,
                private msSqlite : MsSqlite,
                private sync : SyncService,
                private readlocal : ReadlocalService,
                private rcResful:RcRestful) {
  }


  /**
   * 重复类型日程更新
   * @param {RcModel} rc
   * @param {string} ed 日程变更时间
   * @param {string} ia 0更新当天的，1更新以后的，2关闭以后的
   * @returns {Promise<BsModel>}
   */
  repeatRc(orc:RcModel,nrc:RcModel,ed:string,ia:string):Promise<BsModel>{
    return new Promise((resolve, reject) => {
      let rce = new RcEntity();
      rce.sI = orc.sI;
      rce.ed = ed;
      let edt = new Date(ed).getTime();
      rce.ed = moment(edt- 24*60*60*1000).format('YYYY/MM/DD HH:mm');
      //关闭原日程的结束日期
      this.workSqlite.update(rce).then(data=>{
        if(ia != '2'){
          //插入一条当前最新的
          return this.arc(nrc.sN,nrc.sd,nrc.lI,nrc.ji,nrc.cft,nrc.rm,nrc.ac,nrc.rus);
        }
      }).then(data=>{
        //重复类型：0日，1周，2月，3年
        if(ia =='0'  && orc.cft != '' && orc.cft){
          if(orc.cft =='0'){
            orc.sd = moment(edt + 24*60*60*1000).format('YYYY/MM/DD HH:mm');
          }else if(orc.cft =='1'){
            orc.sd = moment(edt + 7*24*60*60*1000).format('YYYY/MM/DD HH:mm');
          }else if(orc.cft =='2'){
            let sdn:number=Number(orc.sd.substr(0,4));
            let sdm:number=Number(orc.sd.substr(4,2));
            if(sdm==12){
              sdn+=1;
              sdm=101;
            }else{
              sdm=100+sdm+1;
            }
            let sdms = sdm.toString().substr(1,2);
            orc.sd = sdn+'/'+sdms+orc.sd.substr(7,8);
          }else if(orc.cft =='3'){
            let sdn:number=Number(orc.sd.substr(0,4))+1;
            orc.sd = sdn+orc.sd.substr(4,10);
          }
          //更改以后的
          return this.arc(orc.sN,orc.sd,orc.lI,orc.ji,orc.cft,orc.rm,orc.ac,orc.rus);
        }
      })


    })
  }


  /**
   * 添加日程
   * @param {string} ct 标题
   * @param {string} sd 开始时间
   * @param {string} ed 结束时间
   * @param {string} lbI 标签编号
   * @param {string} jhi 计划名称
   * @param {Array}  ruL 参与人json数组[ {id,rN,rC} ]（id主键,rN名称,rC联系方式）
   */
  arc(ct:string,sd:string,lbI:string,jhi:string,cft:string,rm:string,ac:string,ruL:Array<RuModel>):Promise<BsModel>{
    return new Promise((resolve, reject) => {
      let bs = new BsModel();
      //先查询当前用户ID
      let rc = new RcEntity();
      sd=sd.replace(new RegExp('-','g'),'/');
      rc.uI=DataConfig.uInfo.uI;
      rc.sN=ct;
      rc.sd=sd;
      if(cft && cft != null && cft != ''){
        rc.ed='2999/12/31 23:59';
      }else{
        rc.ed=sd;
      }
      if(DataConfig.IS_NETWORK_CONNECT){
        rc.fi='0';
      }else{
        rc.fi='1'
      }
      rc.lI=lbI;
      rc.ji=jhi;
      rc.sI=this.util.getUuid();
      let psl = new Array<PsModel>();
      console.log("----- workService arc 添加日程开始-------");
      let isMe = false;
      this.workSqlite.save(rc).then(data=>{
          console.log("----- workService arc 添加日程返回结果：" + JSON.stringify(data));
          console.log("----- workService arc 添加日程子表-------");
          return this.workSqlite.addLbData(rc.sI,rc.lI,cft,rm,ac,'0');
        }).then(data=>{
          if(ruL && ruL.length>0){
            //转化接口对应的参与人参数
            if(ruL && ruL.length>0){
              for(let i=0;i<ruL.length;i++){
                //排除当前登录人
                if(ruL[i].rI != rc.uI){
                  let ps = new PsModel();
                  ps.userId=ruL[i].rI;
                  ps.accountMobile = ruL[i].rC;
                  psl.push(ps);
                }else{
                  isMe = true;
                }
              }
            }

            if(DataConfig.uInfo.uty=='1'){
              console.log("WorkService arc() restful request " + SkillConfig.BC_SCC+" start");
              return this.rcResful.sc(rc.uI,SkillConfig.BC_SCC,rc.sI,rc.sN,rc.sd,rc.ed,rc.lI,psl,'');
            }
          }
      }).then(data=>{
        console.log("WorkService arc() restful request end : " +JSON.stringify(data));
        if(psl.length>0 && data != null && data.code==0 && data.data.players.length>0){
          let players = data.data.players;
          for(let i=0;i<ruL.length;i++){
            for(let j=0;j<players.length;j++){
              if(ruL[i].rC == players[j].accountMobile){
                  if(players[j].agree){
                    ruL[i].sdt=1;
                    break;
                  }else if(!players[j].player){
                    ruL[i].sdt=2;
                    break;
                  }else if(!players[j].user){
                    ruL[i].sdt=3;
                    break;
                  }
              }
            }
          }
        }
        //没有自己则添加自己
        if(!isMe){
          let ru = new RuModel();
          ru.rI=DataConfig.uInfo.uI;
          ru.hiu=DataConfig.uInfo.hIU;
          ru.rN=DataConfig.uInfo.rn;
          ruL.push(ru);
        }
        return this.workSqlite.sRcps(rc,ruL);
      }).then(data=>{
        console.log("WorkService arc() add 参与人 Success : " +JSON.stringify(data));
        //this.drc(rc.sI,'1')
        resolve(bs);
      }).catch(e=>{
        console.error("WorkService arc() Error : " +JSON.stringify(e));

        bs.code = ReturnConfig.ERR_CODE;
        bs.message=e.message;
        reject(bs);
      })

    })
  }

  /**
   * Mq添加日程
   * @param {string} sI 主键
   * @param {string} cui 日程创建人
   * @param {string} sN 标题
   * @param {string} sd 开始时间
   * @param {string} ed 结束时间
   * @param {string} lbI 标签编号
   * @param {string} jhi 计划名称
   */
  arcMq(sI:string,cui:string,sN:string,sd:string,ed:string,lbI:string,cft:string,rm:string,ac:string):Promise<BsModel>{
    return new Promise((resolve, reject) => {
      let bs = new BsModel();
      //先查询当前用户ID
      let rc = new RcEntity();
      sd=sd.replace(new RegExp('-','g'),'/');
      rc.uI=cui;
      rc.sN=sN;
      rc.sd=sd;
      if(cft && cft != null && cft != ''){
        rc.ed='2999/12/31 23:59';
      }else{
        rc.ed=sd;
      }
      if(ed != null && ed != ''){
        rc.ed=ed;
      }
      rc.ed =rc.ed.replace(new RegExp('-','g'),'/');
      rc.lI=lbI;
      rc.sI=sI;
      console.log("------ WorkService arcMq() Start ------------");
      this.workSqlite.save(rc)
        .then(data=>{
          console.log("----- workService arc 添加日程返回结果：" + JSON.stringify(data));
          console.log("----- workService arc 添加日程子表-------");
          return this.workSqlite.addLbData(rc.sI,rc.lI,cft,rm,ac,'0');
        })
        .then(data=>{
          let ruL=new Array<RuModel>();
          let ru = new RuModel();
          ru.rI=DataConfig.uInfo.uI;
          ru.hiu=DataConfig.uInfo.hIU;
          ru.rN=DataConfig.uInfo.rn;
          ruL.push(ru);
        return this.workSqlite.sRcps(rc,ruL);
      }).then(data=>{
        console.log("------ WorkService arcMq() End ------------");
        resolve(bs);
      }).catch(e=>{
        console.error("WorkService arcMq() Error : " +JSON.stringify(e));
        bs.code = ReturnConfig.ERR_CODE;
        bs.message=e.message;
        reject(bs);
      })
    })
  }

  /**
   * 更新日程
   * @param {string} sI 日程主键
   * @param {string} ct 标题
   * @param {string} sd 开始时间
   * @param {string} ed 结束时间
   * @param {string} lbI 标签编号
   * @param {string} jhi 计划名称
   * @param {Array}  ruL 参与人json数组[ {id,rN,rC} ]（id主键,rN名称,rC联系方式）
   */
  urc(sI:string,ct:string,sd:string,ed:string,lbI:string,jhi:string,subId:string,cft:string,rm:string,ac:string,ruL:Array<RuModel>):Promise<BsModel>{
    return new Promise((resolve, reject) => {
      let bs = new BsModel();
      //先查询当前用户ID
      let rc = new RcEntity();
      rc.uI=DataConfig.uInfo.uI;
      sd=sd.replace(new RegExp('-','g'),'/');;
      rc.sN=ct;
      rc.sd=sd;
      if(cft && cft != null && cft != ''){
        rc.ed='2999/12/31 23:59';
      }else{
        rc.ed=sd;
      }
      if(ed != null && ed != ''){
        rc.ed=ed;
      }
      rc.ed =rc.ed.replace(new RegExp('-','g'),'/');
      if(DataConfig.IS_NETWORK_CONNECT){
        rc.fi='0';
      }else{
        rc.fi='1'
      }
      rc.lI=lbI;
      rc.ji=jhi;
      rc.sI=sI;
      let psl = new Array<PsModel>();
      this.workSqlite.update(rc).then(datau=>{
        //转化接口对应的参与人参数
        if(ruL && ruL.length>0){
          for(let i=0;i<ruL.length;i++){
            //排除当前登录人
            if(ruL[i].rI != rc.uI){
              let ps = new PsModel();
              ps.userId=ruL[i].rI;
              ps.accountMobile = ruL[i].rC;
              psl.push(ps);
            }
          }
        }
        //参与人大于0则访问后台接口
        if(psl.length>0){
          console.log("WorkService urc() restful " + SkillConfig.BC_SCU+" start");
          return this.rcResful.sc(rc.uI,SkillConfig.BC_SCU,rc.sI,rc.sN,rc.sd,rc.ed,rc.lI,psl,'');
        }
      })
        .then(data=>{
          console.log("----- workService arc 更新日程返回结果：" + JSON.stringify(data));
          console.log("----- workService arc 更新日程子表-------");
          return this.workSqlite.updateLbData(subId,rc.sI,rc.lI,cft,rm,ac,'0');
        })
        .then(data=>{
        console.log("WorkService urc() end : " +JSON.stringify(data));
        if(psl.length>0 && data.code==0 && data.data.players.length>0){
          let players = data.data.players;
          for(let i=0;i<ruL.length;i++){

            for(let j=0;j<players.length;j++){
              if(ruL[i].rC == players[j].accountMobile){
                if(players[j].agree){
                  ruL[i].sdt=1;
                  break;
                }else if(!players[j].player){
                  ruL[i].sdt=2;
                  break;
                }else if(!players[j].user){
                  ruL[i].sdt=3;
                  break;
                }
              }
            }
            //先删除再添加
            this.workSqlite.dRcps(rc.sI).then(data=>{
              return this.workSqlite.sRcps(rc,ruL);
            }).then(data=>{
              resolve(bs);
            }).catch(e=>{
              console.error("WorkService arc() Error : " +JSON.stringify(e));
              bs.code = ReturnConfig.ERR_CODE;
              bs.message=ReturnConfig.ERR_MESSAGE;
              reject(bs);
            })
          }
        }else{
          resolve(bs);
        }

      }).catch(eu=>{
        bs.code = ReturnConfig.ERR_CODE;
        bs.message=ReturnConfig.ERR_MESSAGE;
        resolve(bs);
      })
    })
  }


  /**
   * Mq更新日程
   * @param {string} sN 标题
   * @param {string} sd 开始时间
   * @param {string} ed 结束时间
   * @param {string} lbI 标签编号
   * @param {string} jhi 计划名称
   * @param {Array}  ruL 参与人json数组[ {id,rN,rC} ]（id主键,rN名称,rC联系方式）
   */
  urcMq(sI:string,cui:string,sN:string,sd:string,ed:string,lbI:string,subId:string,cft:string,rm:string,ac:string):Promise<BsModel>{
    return new Promise((resolve, reject) => {
      let bs = new BsModel();
      sd=sd.replace(new RegExp('-','g'),'/');
      //先查询当前用户ID
      let rc = new RcEntity();
      rc.uI=cui;
      rc.sN=sN;
      rc.sd=sd;
      if(cft && cft != null && cft != ''){
        rc.ed='2999/12/31 23:59';
      }else{
        rc.ed=sd;
      }
      if(ed != null && ed != ''){
        rc.ed=ed;
      }
      rc.ed =rc.ed.replace(new RegExp('-','g'),'/');
      rc.lI=lbI;
      rc.sI=sI;
      console.log("------ WorkService arcMq() Start ------------");
      this.baseSqlite.update(rc).then(data=>{
        let rcp = new RcpEntity();
        rcp.uI=DataConfig.uInfo.uI;
        rcp.sI=sI;
        rcp.sa='0';
        rcp.pI=this.util.getUuid();
        rcp.sdt=1;
        rcp.son=rc.sN;
        return this.baseSqlite.update(rcp);
      })
        .then(data=>{
          console.log("----- workService arc 更新日程返回结果：" + JSON.stringify(data));
          console.log("----- workService arc 更新日程子表-------");
          return this.workSqlite.updateLbData(subId,rc.sI,rc.lI,cft,rm,ac,'0',);
        })
        .then(data=>{
        console.log("------ WorkService arcMq() End ------------");
      }).catch(e=>{
        console.error("WorkService arcMq() Error : " +JSON.stringify(e));
        bs.code = ReturnConfig.ERR_CODE;
        bs.message=e.message;
        reject(bs);
      })
    })
  }

  /**
   * 删除日程
   * @param {string} sI 日程主键
   * @param {string} sa 修改权限 0不可修改，1可修改
   */
  drc(sI:string,sa:string):Promise<BsModel>{
    return new Promise((resolve, reject) => {
      let bs = new BsModel();
      if(sa != '0'){
        let rc = new RcEntity();
        rc.sI = sI;
        let ruL= new Array<RuModel>();
        let rcpL= new Array<RcpEntity>();
        let psl = new Array<PsModel>();
        console.log('--------- 删除的日程开始 ---------');
        this.workSqlite.delete(rc)
          .then(datad => {
            console.log('--------- 删除的日程结束 ---------');
            console.log('--------- 查询要删除的参与人开始 ---------');
            return this.relmem.getRgusBySi(sI);
        })
          .then(data => {
            if(data && data.rows && data.rows.length>0) {
              let rs = data.rows;
              for (let i = 0; i < rs.length; i++) {
                ruL.push(rs.item(i));
                rcpL.push(rs.item(i));
              }
            }
            console.log('--------- 删除的参与人开始 ---------');
          return this.workSqlite.dRcps(sI);
        })
          .then(data=>{
            console.log('--------- 删除的参与人结束 ---------');
          if(ruL && ruL.length>0){
            //转化接口对应的参与人参数
            if(ruL && ruL.length>0){
              for(let i=0;i<ruL.length;i++){
                //排除当前登录人
                //if(ruL[i].rI != rc.uI){
                let ps = new PsModel();
                ps.userId=ruL[i].rI;
                ps.accountMobile = ruL[i].rC;
                psl.push(ps);
                //}
              }
            }
            console.log("WorkService drc() 删除日程 restful request " + SkillConfig.BC_SCD+" start");
            return this.rcResful.sc(DataConfig.uInfo.uI,SkillConfig.BC_SCD,rc.sI,'123','2019-01-07','2019-01-07','1',psl,'');
          }
        }).then(data=>{
          console.log("WorkService drc() 删除日程 restful request END " + JSON.stringify(data));
          //同步删除参与人表
          return this.workSqlite.syncRgcTime(rcpL,DataConfig.AC_D)
        }).then(data=>{
          console.log("WorkService drc() 删除日程同步上传删除参与人 restful request END " + JSON.stringify(data));
          resolve(bs);
        }).catch(eu => {
          console.log("WorkService drc() 删除日程 ERROR " + JSON.stringify(eu));
          bs.code = ReturnConfig.ERR_CODE;
          bs.message = ReturnConfig.ERR_MESSAGE;
          resolve(bs)
        })
      }else{
        bs.code = ReturnConfig.ERR_CODE;
        bs.message = '无权限删除';
        resolve(bs);
      }
    })
  }

  /**
   * 删除日程
   * @param {string} sI 日程主键
   * @param {string} sa 修改权限 0不可修改，1可修改
   */
  mqDrc(rc:RcModel):Promise<BsModel>{
    return new Promise((resolve, reject) => {
      let bs = new BsModel();
      let rce= new RcEntity();
      rce.sI = rc.sI;
      rce.df = '1';
      let ruL:Array<RuModel> = new Array<RuModel>();
      let psl = new Array<PsModel>();
      console.log('--------- MQ逻辑删除的日程开始 ---------');
      this.baseSqlite.update(rce)
        .then(datad => {
          console.log('--------- MQ逻辑删除的日程结束 ---------');
          return this.workSqlite.syncRcTime(rce,DataConfig.AC_D);
        }).then(data=>{
        console.log('--------- 同步上传服务删除的日程 ---------');
        resolve(bs);
      }).catch(eu => {
          bs.code = ReturnConfig.ERR_CODE;
          bs.message = eu.message;
          resolve(bs)
        })
    })
  }

  /**
   * 读取消息后删除fd为1的日程
   * @param {string} sI 日程主键
   * @param {string} sa 修改权限 0不可修改，1可修改
   */
  msDrc(rc:RcModel):Promise<BsModel>{
    return new Promise((resolve, reject) => {
      let bs = new BsModel();
      let rce= new RcEntity();
      rce.sI = rc.sI;
      console.log('--------- 删除的日程开始 ---------');
      this.baseSqlite.delete(rce)
        .then(datad => {
          console.log('--------- 删除的日程结束 ---------');
          console.log('--------- 删除的参与人开始 ---------');
          return this.workSqlite.dRcps(rc.sI);
        })
        .then(data=>{
          console.log('--------- 删除的参与人结束 ---------');
          resolve(bs);
        }).catch(eu => {
          bs.code = ReturnConfig.ERR_CODE;
          bs.message = eu.message;
          resolve(bs)
        })
    })
  }


  /**
   * 批量删除日程
   * @param {string} rcL 日程List
   * @param {string} len 默认为零
   */
  batchDel(rcL:Array<RcModel>,len:number):Promise<BsModel>{
    return new Promise((resolve, reject) => {
      let base = new BsModel();
      if(len<rcL.length){
        console.log("======== 批量删除日程开始 Start===========");
        this.drc(rcL[len].sI,'1').then(data=>{
          console.log("======== 批量删除日程第"+ len +"次结束===========");
           this.batchDel(rcL,len+1);
        }).catch(e=>{
          base.code=ReturnConfig.ERR_CODE;
          base.message=ReturnConfig.ERR_MESSAGE;
          reject(e)
        })
      }else{
        console.log("======== 批量删除日程全部结束  End ===========");
        base.data = len;
        resolve(base);
      }

    })
  }



  /**
   * 查询每月事件标识
   * @param ym
   * @returns {Promise<MbsoModel>}
   */
  getMBs(ym): Promise<MbsoModel> {
    ym=ym.replace(new RegExp('-','g'),'/');
    return new Promise((resolve, reject) => {
      let mbso = new MbsoModel();
      console.log("----- WorkService getMBs(获取当月标识) start -----");
      this.workSqlite.getMBs(ym,DataConfig.uInfo.uI).then(data => {
        console.log("----- WorkService getMBs(获取当月标识) result:" + JSON.stringify(data));
        mbso.code = ReturnConfig.SUCCESS_CODE;
        let mbsl = new Array<MbsModel>();
        if (data.code==0&&data.data.length > 0) {
          for (let i = 0; i < data.data.length; i++) {
            let mbs = new MbsModel();
            mbs.date = new Date(data.data[i].ymd);
            if (data.data[i].ct > 5) {
              mbs.im = true;
            }
            if (data.data[i].mdn != null) {
              mbs.iem = true;
            }
            mbsl.push(mbs)
          }
        }
        mbso.bs = mbsl;
        resolve(mbso);
      }).catch(e => {
        console.error("----- WorkService getMBs(获取当月标识) Error:" + JSON.stringify(e));
        mbso.code = ReturnConfig.ERR_CODE;
        mbso.message = e.message;
        reject(mbso);
      })
    })
  }

  /**
   * 查询当天事件
   * @param d 'yyyy-MM-dd'
   */
  getOd(d:string):Promise<RcpoModel>{
    d=d.replace(new RegExp('-','g'),'/');
    return new Promise((resolve, reject) =>{
      let rcpo = new RcpoModel();
      console.log("----- WorkService getOd(获取当天事件) start -----");
      this.workSqlite.getOd(d,DataConfig.uInfo.uI).then(data=>{
        console.log("----- WorkService getOd(获取当天事件) result:" + JSON.stringify(data));
        let rcps = new Array<ScheduleModel>();
        if(data.code==0 &&data.data.length>0){
          for(let i=0;i<data.data.length;i++){
            let rcp = new ScheduleModel();
            rcp = data.data[i];
            rcps.push(rcp);
          }
        }
        rcpo.slc = rcps;
        resolve(rcpo);
      }).catch(e=>{
        console.error("----- WorkService getOd(获取当天事件) Error:" + JSON.stringify(e));
        rcpo.code=ReturnConfig.ERR_CODE;
        rcpo.message=e.message;
        reject(rcpo)
      })
    })
  }

  /**
   * 根据条件查询日程
   * @param {string} ct 标题
   * @param {string} sd 开始时间
   * @param {string} ed 结束时间
   * @param {string} lbI 标签编号
   * @param {string} lbN 标签名称
   * @param {string} jh 计划名称
   */
  getwL(ct:string,sd:string,ed:string,lbI:string,lbN:string,jh:string,flag:string):Promise<RcoModel>{
    return new Promise((resolve, reject) =>{
      let rco = new RcoModel();
      console.log("----- WorkService getwL(根据条件查询日程) start -----");
      if(sd && sd != null && sd != ''){
        sd = sd.replace(new RegExp('-','g'),'/');
      }
      if(ed && ed != null && ed != ''){
        ed = ed.replace(new RegExp('-','g'),'/');
      }
      let rcs = new Array<RcModel>();
      rco.rcL=rcs;
      this.workSqlite.getwL(ct,sd,ed,lbI,lbN,jh).then(data=>{
        console.log("----- WorkService getwL(根据条件查询日程) result:" + JSON.stringify(data));

        if(data && data.rows && data.rows.length>0){
          if(sd == ed){
            for(let i=0;i<data.rows.length;i++){
              let rc:RcModel = data.rows.item(i);
              if(this.workSqlite.isymwd(rc.cft,sd,rc.sd,rc.ed)){
                rc.sd = sd.substr(0,10)+" " + rc.sd.substr(11,16);
                rcs.push(rc);
              }
            }
          }else{
            let sdt = new Date(sd.substr(0,10)).getTime();
            let dv = (new Date(ed.substr(0,10)).getTime() - sdt)/(1000*60*60*24)
            for(let i=0;i<=dv;i++){
              let day = moment(sdt+i*1000*60*60*24).format('YYYY/MM/DD')
              for(let j=0;j<data.rows.length;j++){
                let rc:RcModel = data.rows.item(j);
                if(this.workSqlite.isymwd(rc.cft,day,rc.sd,rc.ed)){
                  rc.sd = day.substr(0,10)+" " + rc.sd.substr(11,16);
                  rcs.push(rc);
                }
              }
            }
          }


        }else{
          rco.code=ReturnConfig.NULL_CODE;
          rco.message=ReturnConfig.NULL_MESSAGE;
        }
        rco.rcL=rcs;
        if(flag == '1'){
          return this.readlocal.findEventRc(ct,new Date(sd),new Date(ed),rco.rcL);
        }
      }).then(data=>{
        if(flag == '1'){
          rco = data;
        }
        resolve(rco);
      }).catch(e=>{
        console.error("----- WorkService getwL(根据条件查询日程) Error:" + JSON.stringify(e));
        rco.code=ReturnConfig.ERR_CODE;
        rco.message=e.message;
        reject(rco);
      })
    });
  }

  /**
   * 事件详情
   * @param {string} pI 日程ID
   * @returns {Promise<RcpModel>}
   */
  getds(sI:string):Promise<RcModel>{
    return new Promise((resolve, reject) =>{
      let rc= new RcModel();
      console.log("----- WorkService getds(事件详情) start -----");
      this.workSqlite.getds(sI).then(data=>{
        console.log("----- WorkService getds(事件详情) result:" + JSON.stringify(data));
          if(data&&data.rows&&data.rows.length>0){
            rc= data.rows.item(0);
          }else{
            rc.code=ReturnConfig.NULL_CODE;
            rc.message=ReturnConfig.NULL_MESSAGE;
          }
          return this.relmem.getRgusBySi(sI);
      }).then(data=>{
        let rus = new Array<RuModel>();
        rc.rus = rus;
        if(data && data.rows && data.rows.length>0){
          let rs=data.rows;
          let rus = new Array<RuModel>();
          for(let i=0;i<rs.length;i++){
            let ru = new RuModel();
            if(rs.item(i).uI == rc.uI){
              ru.rN=DataConfig.uInfo.uN;
              ru.ran=DataConfig.uInfo.uN;
              ru.rI=DataConfig.uInfo.uI;
              ru.hiu=DataConfig.uInfo.hIU;
            }else{
              ru = rs.item(i);
            }
            rus.push(ru);
          }
          rc.rus = rus;
        }
        let ms = new MsEntity();
        ms.rI=rc.sI;
        return this.msSqlite.updateMs(ms);
      }).then(data=>{
        if(rc.df=='1'){
          console.log("----- WorkService getds(事件详情) 删除df状态是1的日程 -------" );
          return this.msDrc(rc);
        }
        resolve(rc);
      }).then(data=>{
        resolve(rc);
      }).catch(e=>{
        console.error("----- WorkService getds(事件详情) Error:" + JSON.stringify(e));
        rc.code=ReturnConfig.ERR_CODE;
        rc.message=ReturnConfig.ERR_MESSAGE;
        reject(rc);
      })
    });
  }

  /**
   * MQ删除日程
   * @param {string} sI 主键
   * @returns {Promise<BsModel>}
   */
  delrc(sI:string,sn:string,sd:string,ed:string):Promise<BsModel> {
    return new Promise((resolve, reject) => {
      let rc = new RcEntity();
      rc.sI=sI;
      let bs = new BsModel();
      console.log("----- WorkService delrc(删除日程) start -----");
      //先查询日程
      this.baseSqlite.getOne(rc)
      .then(data=>{
        if(data && data.rows && data.rows.length>0){
          //插入message表
          let ms = new MsEntity();
          ms.mn=data.rows.item(0).sN;
          ms.md=data.rows.item(0).sd;
          ms.mt='0';
          return this.msSqlite.addMs(ms);
        }
      })
        .then(data=>{
          //删除日程
        return this.baseSqlite.delete(rc);
      })
        .then(data=>{
          console.log("----- WorkService delrc(删除日程) result:" + JSON.stringify(data));
          console.log('--------- 删除的参与人开始 ---------');
          return this.workSqlite.dRcps(sI);
      }).then(data=>{
        console.log('--------- 删除的参与人结束 ---------');
        resolve(bs);
      })
        .catch(e=>{
        console.error("----- WorkService delrc(删除日程) Error:" + JSON.stringify(e));
        bs.code=ReturnConfig.ERR_CODE;
        bs.message=e.message;
      })
    })
  }

  /**
   * 查询标签
   */
  getlbs():Promise<LboModel>{
    return new Promise((resolve, reject) =>{
      let lbo = new LboModel();
      this.lbSqlite.getlbs().then(data=>{
        let lbs = new Array<LbModel>();
        if(data && data.rows && data.rows.length>0){
          for(let i=0;i<data.rows.length;i++){
            let lb = new LbModel();
            lb = data.rows.item(i);
            lbs.push(lb);
          }
        }
        lbo.lbs=lbs;
        resolve(lbo);
      }).catch(e=>{
        lbo.code=ReturnConfig.ERR_CODE;
        lbo.message=e.message;
        reject(lbo);
      })
    });
  }

  /**
   *
   * @returns {Promise<LboModel>}
   */
  xfAddrc(sn:string,st:string,py:string,ca:string,cb:string):Promise<RcModel>{
    return new Promise((resolve, reject) =>{
      let rc = new RcModel();
      rc.sN=sn;
      rc.sd=st;
      let nopy=py; //不存在的联系人
      let ruL = new Array<RuModel>();
      rc.rus=ruL;
      console.log("---------- WorkService 讯飞语音添加日程 Start ------------");
      console.log("  ------ WorkService 讯飞语音添加日程: 匹配参与人 ----");
      this.relmem.xfGetRu(py).then(data=>{
        console.log("  ------ WorkService 讯飞语音添加日程: 匹配参与人查询结果：" + JSON.stringify(data));
          if(data && data.rows&&data.rows.length>0){
            //获取不存在的联系人 pinyin名称
            for(let i=0;i<data.rows.length;i++){
              let ru:RuModel = data.rows.item(i);
              ruL.push(ru);
              let npy = '';
              let istrue = false;
              if(ru.ran && ru.ran != null && ru.ran != ''){
                npy = this.util.chineseToPinYin(ru.ran);
                nopy = nopy.replace(npy,'');
                istrue = true;
              }
              if(!istrue&&ru.rN && ru.rN != null && ru.rN != ''){
                npy = this.util.chineseToPinYin(ru.rN);
                nopy = nopy.replace(npy,'');
              }
            }
          }

          let nopyL:Array<string> = nopy.split(",");
          let caL = ca.split(",");
          let cbL = cb.split(",");
          let noca='';//获取不存在的联系人中文名称
          let nocb='';//获取不存在的联系人 解析中文名称
          for(let j=0;j<nopyL.length;j++){
            for(let a=0;a<caL.length;a++){
              let capy = this.util.chineseToPinYin(caL[a]);
              if(nopyL[j] == capy){
                if(noca == ''){
                  noca = caL[a];
                }else{
                  noca = "," + caL[a];
                }
              }
            }
            for(let b=0;b<cbL.length;b++){
              let cbpy = this.util.chineseToPinYin(cbL[b]);
              if(nopyL[j] == cbpy){
                if(nocb == ''){
                  nocb = caL[b];
                }else{
                  nocb = "," + caL[b];
                }
              }
            }
          }

        rc.noca=noca;
        rc.nocb=nocb;
        let strL = nocb.split(',');
        for(let a = 0;a<strL.length;a++){
          let run = new RuModel();
          run.rN = strL[0];
          run.ran = strL[0];
          run.hiu = DataConfig.NOT_PLAYER;
          ruL.push(run);
        }
        rc.rus=ruL;
        resolve(rc)
      }).catch(e=>{
        console.error("-------- WorkService 讯飞语音添加日程 ERROR : " + JSON.stringify(e));
        rc.code=ReturnConfig.ERR_CODE;
        rc.message=ReturnConfig.ERR_MESSAGE;
        reject(rc)
      })

    })

  }

  /**
   * 联网状态查询未发送邀请信息，并发送消息
   * @returns {Promise<any>}
   */
  nwSendRu():Promise<BsModel>{
    return new Promise((resolve, reject)=>{
      let bs = new BsModel();
      let rgcL:any = {};
      console.log( "-------- 联网状态，开始查询日程信息 --------");
      this.workSqlite.getNoSendRgc().then(data=>{
        if(data && data.rows && data.rows.length>0){
          rgcL = data.rows;
          console.log( "-------- 联网状态，开始发送日程 --------");
          return this.workSqlite.getNoSendRc();
        }else{
          bs.code = ReturnConfig.NULL_CODE;
          bs.message = ReturnConfig.NULL_MESSAGE;
        }
      }).then(data=>{
        if(rgcL!=null && rgcL.length>0){
            if(data && data.rows && data.rows.length>0){
              let scheduleList = new Array<any>();
              for(let i = 0;i<data.rows.length;i++){
                let schedule:any = bs;
                let rc:RcModel = data.rows.item(i);
                schedule.scheduleId = rc.sI;
                schedule.scheduleName = rc.sN;
                schedule.startTime = rc.sd;
                schedule.endTime = rc.ed;
                schedule.label = rc.lI;
                schedule.status='';
                let players = new Array<any>();
                for(let j=0;j<rgcL.length;j++){
                  let rgc:RuModel = rgcL.item(j);
                  let player:any = bs;
                  player.accountMobile = rgc.rC;
                  player.userId = rgc.rI;
                  players.push(player);
                }
                schedule.players = players;
                scheduleList.push(schedule);
              }
            }
          console.log( "-------- 联网状态，开始发送日程成功 --------");
        }
        resolve(bs)
      }).catch(e=>{
        console.error( "-------- 联网状态，查询并发送日程失败 ：" + JSON.stringify(e));
        bs.code=ReturnConfig.ERR_CODE;
        bs.message=ReturnConfig.ERR_MESSAGE;
        reject(bs)
      })
    })
  }
}
