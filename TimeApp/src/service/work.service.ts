import {Injectable} from "@angular/core";
import {WorkSqliteService} from "./sqlite-service/work-sqlite.service";
import {MbsoModel} from "../model/out/mbso.model";
import {MbsModel} from "../model/mbs.model";
import {RcpoModel} from "../model/out/rcpo.model";
import {RcpModel} from "../model/rcp.model";
import {BsModel} from "../model/out/bs.model";
import {RuModel} from "../model/ru.model";
import {RcEntity} from "../entity/rc.entity";
import {BaseSqliteService} from "./sqlite-service/base-sqlite.service";
import {UtilService} from "./util-service/util.service";
import {UserSqliteService} from "./sqlite-service/user-sqlite.service";
import {RcModel} from "../model/rc.model";
import {AppConfig} from "../app/app.config";
import {LbSqliteService} from "./sqlite-service/lb-sqlite.service";
import {LboModel} from "../model/out/lbo.model";
import {LbModel} from "../model/lb.model";

/**
 * 日程逻辑处理
 *
 * create by wzy on 2018/11/09
 */
@Injectable()
export class WorkService {
  workSqlite: WorkSqliteService;
  userSqlite: UserSqliteService;
  lbSqlite: LbSqliteService;
  constructor(private baseSqlite:BaseSqliteService,
                private util:UtilService) {
    this.workSqlite = new WorkSqliteService(baseSqlite,util);
    this.userSqlite = new UserSqliteService(baseSqlite);
    this.lbSqlite = new LbSqliteService(baseSqlite);
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
  arc(ct:string,sd:string,ed:string,lbI:string,jhi:string,ruL:Array<RuModel>):Promise<BsModel>{
    return new Promise((resolve, reject) => {
      let bs = new BsModel();
      //先查询当前用户ID
      this.userSqlite.getUo().then(data=>{
        if(data && data.rows && data.rows.length>0){
          let rc = new RcEntity();
          rc.uI=data.rows.item(0).uI;
          rc.sN=ct;
          rc.sd=sd;
          rc.ed=ed;
          rc.lI=lbI;
          rc.ji=jhi;
          rc.sI=this.util.getUuid();
          this.baseSqlite.save(rc).then(data=>{
            this.workSqlite.sRcps(rc,ruL)
          })
          resolve(bs)
        }
      }).catch(e=>{
        bs.code = AppConfig.ERR_CODE
        bs.message=e.message
        resolve(bs)
      })

    })
  }

  /**
   * 查询每月事件标识
   * @param ym
   * @returns {Promise<MbsoModel>}
   */
  getMBs(ym): Promise<MbsoModel> {
    return new Promise((resolve, reject) => {
      let mbso = new MbsoModel();
      this.workSqlite.getMBs(ym).then(data => {
        mbso.code = 0;
        let mbsl = new Array<MbsModel>()
        if (data && data.rows && data.rows.length > 0) {
          for (let i = 0; i < data.rows.length; i++) {
            let mbs = new MbsModel();
            mbs.date = new Date(data.rows.item(i).ymd);
            if (data.rows.item(i).ct > 5) {
              mbs.im = true;
            }
            if (data.rows.item(i).mdn != null) {
              mbs.iem = true;
            }
            mbsl.push(mbs)
          }
        }
        mbso.bs = mbsl;
        resolve(mbso);
      }).catch(e => {
        mbso.code = 1;
        mbso.message = e.message;
        reject(mbso)
      })
    })
  }

  /**
   * 查询当天事件
   * @param d 'yyyy-MM-dd'
   */
  getOd(d:string):Promise<RcpoModel>{
    return new Promise((resolve, reject) =>{
      let rcpo = new RcpoModel();
      this.workSqlite.getOd(d).then(data=>{
        let rcps = new Array<RcpModel>()
        if(data && data.rows && data.rows.length>0){
          for(let i=0;i<data.rows.length;i++){
            let rcp = new RcpModel();
            rcp = data.rows.item(i);
            rcps.push(rcp);
          }
        }
        rcpo.sjl = rcps;
        resolve(rcpo);
      }).catch(e=>{
        rcpo.code=AppConfig.ERR_CODE;
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
  getwL(ct:string,sd:string,ed:string,lbI:string,lbN:string,jh:string):Promise<RcpoModel>{
    return new Promise((resolve, reject) =>{
      let rcpo = new RcpoModel();
      this.workSqlite.getwL(ct,sd,ed,lbI,lbN,jh).then(data=>{
        let rcps = new Array<RcpModel>()
        if(data && data.rows && data.rows.length>0){
          for(let i=0;i<data.rows.length;i++){
            let rcp = new RcpModel();
            rcp = data.rows.item(i);
            rcps.push(rcp);
          }
        }
        rcpo.sjl=rcps;
        resolve(rcpo)
      }).catch(e=>{
        rcpo.code=AppConfig.ERR_CODE;
        rcpo.message=e.message;
        reject(rcpo)
      })
    });
  }

  /**
   * 事件详情
   * @param {string} sI 日程ID
   * @returns {Promise<RcpModel>}
   */
  getdetails(sI:string):Promise<RcModel>{
    return new Promise((resolve, reject) =>{
      let rc= new RcModel();
      this.workSqlite.getds(sI).then(data=>{
          if(data&&data.rows&&data.rows.length>0){
            rc= data.rows.item(0);
            resolve(rc);
          }else{
            rc.code=AppConfig.NULL_CODE
            rc.message=AppConfig.NULL_MESSAGE
            resolve(rc);
          }
      }).catch(e=>{
        rc.code=AppConfig.ERR_CODE
        rc.message=AppConfig.ERR_MESSAGE
        reject(rc);
      })
    });
  }

  /**
   * 删除日程
   * @param {string} sI 主键
   * @returns {Promise<BsModel>}
   */
  delrc(sI:string):Promise<BsModel> {
    return new Promise((resolve, reject) => {
      let rc = new RcEntity()
      rc.sI=sI;
      let bs = new BsModel();
      this.baseSqlite.delete(rc).then(data=>{
        resolve(bs)
      }).catch(e=>{
        bs.code=AppConfig.ERR_CODE;
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
        let lbs = new Array<LbModel>()
        if(data && data.rows && data.rows.length>0){
          for(let i=0;i<data.rows.length;i++){
            let lb = new LbModel();
            lb = data.rows.item(i);
            lbs.push(lb);
          }
        }
        lbo.lbs=lbs;
        resolve(lbo)
      }).catch(e=>{
        lbo.code=AppConfig.ERR_CODE;
        lbo.message=e.message;
        reject(lbo)
      })
    });
  }

}
