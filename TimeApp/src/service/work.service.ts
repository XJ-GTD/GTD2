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
import {HttpClient} from "@angular/common/http";
import {SkillConfig} from "../app/skill.config";
import {RelmemSqlite} from "./sqlite/relmem-sqlite";

/**
 * 日程逻辑处理
 *
 * create by wzy on 2018/11/09
 */
@Injectable()
export class WorkService {
  workSqlite: WorkSqlite;
  relmem: RelmemSqlite;
  lbSqlite: LbSqlite;
  rcResful:RcRestful;
  constructor(private baseSqlite:BaseSqlite,
                private util:UtilService,private http: HttpClient) {
    this.workSqlite = new WorkSqlite(baseSqlite,util);
    this.relmem = new RelmemSqlite(baseSqlite);
    this.lbSqlite = new LbSqlite(baseSqlite);
    this.rcResful = new RcRestful(http);
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
      let rc = new RcEntity();
      rc.uI=DataConfig.uInfo.uI;
      rc.sN=ct;
      rc.sd=sd;
      if(sd == null || sd == ''){
        rc.sd=ed;
      }
      rc.ed=ed;
      if(ed == null || ed == ''){
        rc.ed=sd;
      }
      rc.lI=lbI;
      rc.ji=jhi;
      rc.sI=this.util.getUuid();
      let psl = new Array<PsModel>()
      this.baseSqlite.save(rc).then(data=>{
        if(ruL && ruL.length>0){
          return this.workSqlite.sRcps(rc,ruL)
        }
      }).then(data=>{
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
        //参与人大于0则访问后台接口
        if(psl.length>0){
          console.log("WorkService arc() restful " + SkillConfig.BC_SCC+" start")
          return this.rcResful.sc(rc.uI,SkillConfig.BC_SCC,rc.sI,rc.sN,rc.sd,rc.ed,rc.lI,psl,'')
        }
      }).then(data=>{
        console.log("WorkService arc() end : " +JSON.stringify(data))
        if(psl.length>0 && data.code==0 && data.data.players.length>0){
          let players = data.data.players;
          for(let i=0;i<ruL.length;i++){

            for(let j=0;j<players.length;j++){
              if(ruL[i].rC == players[i].accountMobile){
                  if(players[i].agree){
                    ruL[i].sdt=1
                    break;
                  }else if(!players[i].player){
                    ruL[i].sdt=2
                    break;
                  }else if(!players[i].user){
                    ruL[i].sdt=3
                    break;
                  }
              }
            }
            //先删除再添加
            this.workSqlite.dRcps(rc.sI).then(data=>{
              return this.workSqlite.sRcps(rc,ruL)
            }).then(data=>{
              resolve(bs)
            }).catch(e=>{
              console.error("WorkService arc() Error : " +JSON.stringify(e))
              bs.code = DataConfig.ERR_CODE
              bs.message=e.message
              reject(bs)
            })
          }
        }else{
          resolve(bs)
        }

      }).catch(e=>{
        console.error("WorkService arc() Error : " +JSON.stringify(e))
        bs.code = DataConfig.ERR_CODE
        bs.message=e.message
        reject(bs)
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
  urc(sI:string,ct:string,sd:string,ed:string,lbI:string,jhi:string,ruL:Array<RuModel>):Promise<BsModel>{
    return new Promise((resolve, reject) => {
      let bs = new BsModel();
      //先查询当前用户ID
      let rc = new RcEntity();
      rc.uI=DataConfig.uInfo.uI;
      rc.sN=ct;
      rc.sd=sd;
      if(sd == null || sd == ''){
        rc.sd=ed;
      }
      rc.ed=ed;
      if(ed == null || ed == ''){
        rc.ed=sd;
      }
      rc.lI=lbI;
      rc.ji=jhi;
      rc.sI=sI;
      let psl = new Array<PsModel>()
      this.baseSqlite.update(rc).then(datau=>{
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
          console.log("WorkService urc() restful " + SkillConfig.BC_SCU+" start")
          return this.rcResful.sc(rc.uI,SkillConfig.BC_SCU,rc.sI,rc.sN,rc.sd,rc.ed,rc.lI,psl,'')
        }
      }).then(data=>{
        console.log("WorkService urc() end : " +JSON.stringify(data))
        if(psl.length>0 && data.code==0 && data.data.players.length>0){
          let players = data.data.players;
          for(let i=0;i<ruL.length;i++){

            for(let j=0;j<players.length;j++){
              if(ruL[i].rC == players[i].accountMobile){
                if(players[i].agree){
                  ruL[i].sdt=1
                  break;
                }else if(!players[i].player){
                  ruL[i].sdt=2
                  break;
                }else if(!players[i].user){
                  ruL[i].sdt=3
                  break;
                }
              }
            }resolve(bs)
            //先删除再添加
            // this.workSqlite.dRcps(rc.sI).then(data=>{
            //   return this.workSqlite.sRcps(rc,ruL)
            // }).then(data=>{
            //   resolve(bs)
            // }).catch(e=>{
            //   console.error("WorkService arc() Error : " +JSON.stringify(e))
            //   bs.code = DataConfig.ERR_CODE
            //   bs.message=e.message
            //   reject(bs)
            // })
          }
        }else{
          resolve(bs)
        }

      }).catch(eu=>{
        bs.code = DataConfig.ERR_CODE
        bs.message=eu.message
        resolve(bs)
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
      if(sa == '1'){
        let rc = new RcEntity()
        rc.sI = sI;
        this.baseSqlite.delete(rc).then(datau => {
          return this.workSqlite.dRcps(sI)
        }).then(datad => {
          resolve(bs);
        }).catch(eu => {
          bs.code = DataConfig.ERR_CODE
          bs.message = eu.message
          resolve(bs)
        })
      }else{
        bs.code = DataConfig.ERR_CODE
        bs.message = '无权限删除'
        resolve(bs)
      }


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
      console.log("----- WorkService getMBs(获取当月标识) start -----")
      this.workSqlite.getMBs(ym,DataConfig.uInfo.uI).then(data => {
        console.log("----- WorkService getMBs(获取当月标识) result:" + JSON.stringify(data))
        mbso.code = 0;
        let mbsl = new Array<MbsModel>()
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
        console.error("----- WorkService getMBs(获取当月标识) Error:" + JSON.stringify(e))
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
      console.log("----- WorkService getOd(获取当天事件) start -----")
      this.workSqlite.getOd(d,DataConfig.uInfo.uI).then(data=>{
        console.log("----- WorkService getOd(获取当天事件) result:" + JSON.stringify(data))
        let rcps = new Array<ScheduleModel>()
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
        console.error("----- WorkService getOd(获取当天事件) Error:" + JSON.stringify(e))
        rcpo.code=DataConfig.ERR_CODE;
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
      console.log("----- WorkService getwL(根据条件查询日程) start -----")
      this.workSqlite.getwL(ct,sd,ed,lbI,lbN,jh).then(data=>{
        console.log("----- WorkService getwL(根据条件查询日程) result:" + JSON.stringify(data))
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
        console.error("----- WorkService getwL(根据条件查询日程) Error:" + JSON.stringify(e))
        rcpo.code=DataConfig.ERR_CODE;
        rcpo.message=e.message;
        reject(rcpo)
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
      console.log("----- WorkService getds(事件详情) start -----")
      this.workSqlite.getds(sI).then(data=>{
        console.log("----- WorkService getds(事件详情) result:" + JSON.stringify(data))
          if(data&&data.rows&&data.rows.length>0){
            rc= data.rows.item(0);
          }else{
            rc.code=DataConfig.NULL_CODE
            rc.message=DataConfig.NULL_MESSAGE
          }
          return this.relmem.getRgusBySi(sI)
      }).then(data=>{
        if(data && data.rows && data.rows.length>0){
          let rs=data.rows;
          let rus = new Array<RuModel>();
          for(let i=0;i<rs.length;i++){
            let ru = new RuModel()
            if(rs.item(i).uI == rc.uI){
              ru.rN=DataConfig.uInfo.uN;
              ru.rI=DataConfig.uInfo.uI;
              ru.hiu=DataConfig.uInfo.hIU;
            }else{
              ru = rs.item(i)
            }
            rus.push(ru)
          }
          rc.rus = rus;
        }
        resolve(rc);
      }).catch(e=>{
        console.error("----- WorkService getds(事件详情) Error:" + JSON.stringify(e))
        rc.code=DataConfig.ERR_CODE
        rc.message=DataConfig.ERR_MESSAGE
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
      console.log("----- WorkService delrc(删除日程) start -----")
      this.baseSqlite.delete(rc).then(data=>{
        console.log("----- WorkService delrc(删除日程) result:" + JSON.stringify(data))
        resolve(bs)
      }).catch(e=>{
        console.error("----- WorkService delrc(删除日程) Error:" + JSON.stringify(e))
        bs.code=DataConfig.ERR_CODE;
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
        lbo.code=DataConfig.ERR_CODE;
        lbo.message=e.message;
        reject(lbo)
      })
    });
  }
  test() {
    let ms = new MsEntity();
    ms.mn='test';
    ms.md='2018-12-18 20:12';
    ms.mt='0';
    //插入消息
    this.baseSqlite.save(ms).then(data=>{
      console.log(data);
    })
    let sqlStr = "INSERT INTO GTD_D(pI,son,pd,uI) " +
      "VALUES ('24314','12424','2018-12-18 20:12','123458')";
    this.baseSqlite.executeSql(sqlStr, []).then(data => {
      console.log(data)
    }).catch(e => {
      console.log(e)
    })

    let sqlStr3 = "INSERT INTO GTD_D(pI,son,pd,uI) " +
      "VALUES ('243143','12424','2018-12-17 20:12','123458')";
    this.baseSqlite.executeSql(sqlStr3,[]).then(data=>{
      console.log(data)
    }).catch(e=>{
      console.log(e)
    })

    let sqlStr4 = "INSERT INTO GTD_D(pI,son,pd,uI) " +
      "VALUES ('243144','12424','2018-12-15 20:12','123458')";
    this.baseSqlite.executeSql(sqlStr4,[]).then(data=>{
      console.log(data)
    }).catch(e=>{
      console.log(e)
    })

    let sqlStr5 = "INSERT INTO GTD_D(pI,son,pd,uI) " +
      "VALUES ('243145','12424','2018-12-22 20:12','123458')";
    this.baseSqlite.executeSql(sqlStr5,[]).then(data=>{
      console.log(data)
    }).catch(e=>{
      console.log(e)
    })
  }
}
