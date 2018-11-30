import {Injectable} from "@angular/core";
import {PlayerSqliteService} from "./sqlite-service/player-sqlite.service";
import {RcEntity} from "../entity/rc.entity";
import {RcpEntity} from "../entity/rcp.entity";
import {PeoModel} from "../model/out/peo.model";
import {BsModel} from "../model/out/bs.model";
import {ScheduleModel} from "../model/schedule.model";

/**
 * 日程逻辑处理
 *
 * create by wzy on 2018/11/09
 */
@Injectable()
export class PlayerService {

  constructor( private playerSqliteService:PlayerSqliteService ){ }

  /**
   * 查询日程
   * @param {string} sI UUID
   * @param {string} sN 日程名
   * @param {string} lI 关联标签ID
   * @param {string} uI 创建人ID
   * @param {string} sd 开始时间
   * @param {string} ed 结束时间
   * @param {string} pI 日程参与人表uuID
   * @param {string} son 日程别名
   * @param {string} sa 修改权限
   * @param {string} ps 完成状态
   * @param {string} cd 创建时间
   * @param {string} pd 完成时间
   * @param {string} uIs 参与人ID
   * @param {string} ib 是否本地
   * @returns {Promise<PeoModel>}
   */
  getPlayer(sI:string,sN:string,lI:string,uI:string,sd:string,ed:string,pI:string,son:string,sa:string,ps:string,cd:string,pd:string,uIs:string,ib:string):Promise<PeoModel>{
    return new Promise((resolve, reject) =>{
      let rc=new RcEntity();
      rc.sI=sI;
      rc.sN=sN;
      rc.lI=lI;
      rc.uI=uI;
      rc.sd=sd;
      rc.ed=ed;
      let rcp=new RcpEntity();
      rcp.pI=pI;
      rcp.sI=sI;
      rcp.son=son;
      rcp.sa=sa;
      rcp.ps=ps;
      rcp.cd=cd;
      rcp.pd=pd;
      rcp.uI=uIs;
      rcp.ib=ib;
      let peo=new PeoModel();
      let p=[];
      this.playerSqliteService.getRc(rc).then(data=>{
        if(data&& data.rows && data.rows.length>0){
          for(let i=0;i<data.length;i++){
            p.push(data.rows.item(i));
          }
          peo.rcs=p;
          this.playerSqliteService.getRcp(rcp).then(data=>{
            for(let i=0;i<data.length;i++){
              p.push(data.rows.item(i));
            }
            peo.rcps=p;
            peo.code=0;
            peo.message="success";
          })
            .catch(e=>{
            peo.code=1;
            peo.message=e.message;
            reject(peo);
          })
        }else{
          peo.code=2;
          peo.message="暂无信息"
          resolve(peo);
        }

      })
        .catch(e=>{
          peo.code=1;
          peo.message=e.message;
          reject(peo);
        })
    })
  }

  /**
   * 添加日程
   * @param {string} sI
   * @param {string} sN
   * @param {string} lI
   * @param {string} uI
   * @param {string} sd
   * @param {string} ed
   * @param {string} pI
   * @param {string} son
   * @param {string} sa
   * @param {string} ps
   * @param {string} cd
   * @param {string} pd
   * @param {string} uIs
   * @param {string} ib
   * @returns {Promise<BsModel>}
   */
  addPlayer(sI:string,sN:string,lI:string,uI:string,sd:string,ed:string,pI:string,son:string,sa:string,ps:string,cd:string,pd:string,uIs:string,ib:string):Promise<BsModel>{
    return new Promise((resolve, reject)=>{
      let rc=new RcEntity();
      rc.sI=sI;
      rc.sN=sN;
      rc.lI=lI;
      rc.uI=uI;
      rc.sd=sd;
      rc.ed=ed;
      let rcp=new RcpEntity();
      rcp.pI=pI;
      rcp.sI=sI;
      rcp.son=son;
      rcp.sa=sa;
      rcp.ps=ps;
      rcp.cd=cd;
      rcp.pd=pd;
      rcp.uI=uIs;
      rcp.ib=ib;
      let base=new BsModel();
      this.playerSqliteService.addRc(rc).then(rc=>{
        this.playerSqliteService.addRcp(rcp).then(rcp=>{
          base.code=0;
          base.message="success";
          resolve(base);
        })
          .catch(e=>{
            base.code=1;
            base.message=e.message;
            reject(base);
          })
      })
        .catch(e=>{
        base.code=1;
        base.message=e.message;
        reject(base);
      })
    })
  }

  /**
   * 修改日程
   * @param {string} sI
   * @param {string} sN
   * @param {string} lI
   * @param {string} uI
   * @param {string} sd
   * @param {string} ed
   * @param {string} pI
   * @param {string} son
   * @param {string} sa
   * @param {string} ps
   * @param {string} cd
   * @param {string} pd
   * @param {string} uIs
   * @param {string} ib
   * @returns {Promise<BsModel>}
   */
  updatePlayer(sI:string,sN:string,lI:string,uI:string,sd:string,ed:string,pI:string,son:string,sa:string,ps:string,cd:string,pd:string,uIs:string,ib:string):Promise<BsModel>{
    return new Promise((resolve, reject)=>{
      let rc=new RcEntity();
      rc.sI=sI;
      rc.sN=sN;
      rc.lI=lI;
      rc.uI=uI;
      rc.sd=sd;
      rc.ed=ed;
      let rcp=new RcpEntity();
      rcp.pI=pI;
      rcp.sI=sI;
      rcp.son=son;
      rcp.sa=sa;
      rcp.ps=ps;
      rcp.cd=cd;
      rcp.pd=pd;
      rcp.uI=uIs;
      rcp.ib=ib;
      let base=new BsModel();
      this.playerSqliteService.updateRc(rc).then(rc=>{
        this.playerSqliteService.updateRcp(rcp).then(rcp=>{
          base.code=0;
          base.message="success";
          resolve(base);
        })
          .catch(e=>{
            base.code=1;
            base.message=e.message;
            reject(base);
          })
      })
        .catch(e=>{
          base.code=1;
          base.message=e.message;
          reject(base);
        })
    })
  }

  /**
   * 删除日程
   * @param {string} sI
   * @param {string} sN
   * @param {string} lI
   * @param {string} uI
   * @param {string} sd
   * @param {string} ed
   * @param {string} pI
   * @param {string} son
   * @param {string} sa
   * @param {string} ps
   * @param {string} cd
   * @param {string} pd
   * @param {string} uIs
   * @param {string} ib
   * @returns {Promise<BsModel>}
   */
  delPlayer(sI:string,sN:string,lI:string,uI:string,sd:string,ed:string,pI:string,son:string,sa:string,ps:string,cd:string,pd:string,uIs:string,ib:string):Promise<BsModel>{
    return new Promise((resolve, reject)=>{
      let rc=new RcEntity();
      rc.sI=sI;
      rc.sN=sN;
      rc.lI=lI;
      rc.uI=uI;
      rc.sd=sd;
      rc.ed=ed;
      let rcp=new RcpEntity();
      rcp.pI=pI;
      rcp.sI=sI;
      rcp.son=son;
      rcp.sa=sa;
      rcp.ps=ps;
      rcp.cd=cd;
      rcp.pd=pd;
      rcp.uI=uIs;
      rcp.ib=ib;
      let base=new BsModel();
      this.playerSqliteService.delRc(rc).then(rc=>{
        this.playerSqliteService.delRcp(rcp).then(rcp=>{
          base.code=0;
          base.message="success";
          resolve(base);
        })
          .catch(e=>{
            base.code=1;
            base.message=e.message;
            reject(base);
          })
      })
        .catch(e=>{
          base.code=1;
          base.message=e.message;
          reject(base);
        })
    })
  }

  /**
   * 查询某天的日程
   * @param {string} startTime 某天的00:00
   * @param {string} endTime   某天的23:59
   * @returns {Promise<ScheduleModel[]>}
   */
  getLocalSchedule(startTime:string,endTime:string):Promise<ScheduleModel[]>{
    return new Promise((resolve, reject)=>{
      this.playerSqliteService.getLocalSchedule(startTime,endTime).then(data=>{
        resolve(data);
      })
        .catch(e=>{
          reject(e);
        })
    })
  }
}
