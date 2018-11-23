import {Injectable} from "@angular/core";
import {WorkSqliteService} from "./sqlite-service/work-sqlite.service";
import {MbsoModel} from "../model/out/mbso.model";
import {MbsModel} from "../model/mbs.model";
import {RcpoModel} from "../model/out/rcpo.model";
import {RcpModel} from "../model/rcp.model";

/**
 * 日程逻辑处理
 *
 * create by wzy on 2018/11/09
 */
@Injectable()
export class WorkService {
  constructor(private workSqlite: WorkSqliteService) {
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
        rcpo.code=0;
        let rcps = new Array<RcpModel>()
        if(data && data.rows && data.rows.length>0){
          for(let i=0;i<data.rows.length;i++){
            let rcp = new RcpoModel();
            rcps.push(data.rows.item(i))
          }
        }
        rcpo.sjl = rcps;
        resolve(rcpo);
      }).catch(e=>{
        rcpo.code=1;
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
    return new Promise((resolve, reject) =>{});
  }

  /**
   * 事件详情
   * @param {string} id
   * @returns {Promise<RcpModel>}
   */
  getdetails(id:string):Promise<RcpModel>{
    return new Promise((resolve, reject) =>{});
  }

}
