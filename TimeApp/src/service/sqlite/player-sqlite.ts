import { Injectable } from '@angular/core';
import {BaseSqlite} from "./base-sqlite";
import {RcEntity} from "../../entity/rc.entity";
import {RcpEntity} from "../../entity/rcp.entity";
import {ScheduleModel} from "../../model/schedule.model";


/**
 * 参与人 sqlite
 *
 * create by hjd on 2018/11/23
 */
@Injectable()
export class PlayerSqlite {
  constructor(private baseSqlite: BaseSqlite ) { }

  /**
   * 添加日程
   * @param {RcEntity} rc
   * @returns {Promise<any>}
   */
  addRc(rc:RcEntity){
    return this.baseSqlite.save(rc);
  }

  /**
   * 添加日程参与人
   * @param {RcpEntity} rcp
   * @returns {Promise<any>}
   */
  addRcp(rcp:RcpEntity){
    return this.baseSqlite.save(rcp);
  }

  /**
   * 修改日程
   * @param {RcEntity} rc
   * @returns {Promise<any>}
   */
  updateRc(rc:RcEntity){
    return this.baseSqlite.update(rc);
  }

  /**
   * 修改日程参与人
   * @param {RcpEntity} rcp
   * @returns {Promise<any>}
   */
  updateRcp(rcp:RcpEntity){
    return this.baseSqlite.update(rcp);
  }

  /**
   * 删除日程
   * @param {RcEntity} rc
   * @returns {Promise<any>}
   */
  delRc(rc:RcEntity){
    return this.baseSqlite.delete(rc);
  }

  /**
   * 删除参与人
   * @param {RcpEntity} rcp
   * @returns {Promise<any>}
   */
  delRcp(rcp:RcpEntity){
    return this.baseSqlite.delete(rcp);
  }

  /**
   * 查询日程
   * @param {RcEntity} rc
   * @returns {Promise<any>}
   */
  getRc(rc:RcEntity){
    let sql="select sI,sN,lI,uI,sd,ed from GTD_C where 1=1";
    if(rc.sI!=null){
      sql=sql+' and sI="' + rc.sI +'"';
    }
    if(rc.sN!=null){
      sql=sql+' and sN="' + rc.sN +'"';
    }
    if(rc.lI!=null){
      sql=sql+' and lI="' + rc.lI +'"';
    }
    if(rc.uI!=null){
      sql=sql+' and uI="' + rc.uI +'"';
    }
    if(rc.sd!=null){
      sql=sql+' and sd="' + rc.sd +'"';
    }
    if(rc.ed!=null){
      sql=sql+' and ed="' + rc.ed +'"';
    }
    return this.baseSqlite.executeSql(sql,[]);
  }

  /**
   * 查询日程参与人
   * @param {RcpEntity} rcp
   * @returns {Promise<any>}
   */
  getRcp(rcp:RcpEntity){
    let sql="select pI,sI,son,sa,ps,cd,pd,uI,ib from GTD_D where 1=1";
    if(rcp.pI!=null){
      sql=sql+' and pI="' + rcp.pI +'"';
    }
    if(rcp.sI!=null){
      sql=sql+' and sI="' + rcp.sI +'"';
    }
    if(rcp.son!=null){
      sql=sql+' and son="' + rcp.son +'"';
    }
    if(rcp.sa!=null){
      sql=sql+' and sa="' + rcp.sa +'"';
    }
    if(rcp.ps!=null){
      sql=sql+' and ps="' + rcp.ps +'"';
    }
    if(rcp.cd!=null){
      sql=sql+' and cd="' + rcp.cd +'"';
    }
    if(rcp.pd!=null){
      sql=sql+' and pd="' + rcp.pd +'"';
    }
    if(rcp.uI!=null){
      sql=sql+' and uI="' + rcp.uI +'"';
    }
    if(rcp.ib!=null){
      sql=sql+' and ib="' + rcp.ib +'"';
    }
    if(rcp.bi!=null){
      sql=sql+' and bi="' + rcp.bi +'"';
    }
    return this.baseSqlite.executeSql(sql,[]);
  }

  /**
   * 查找某天的日程
   * @param {string} startTime
   * @param {string} endTime
   * @returns {Promise<ScheduleModel[]>}
   */
  getLocalSchedule(startTime:string,endTime:string){
    return this.baseSqlite.executeSql("SELECT GTD_C.sN,GTD_C.lI,GTD_D.cd,GTD_D.uI " +
      "FROM GTD_C JOIN GTD_D ON GTD_C.sI=GTD_D.sI AND GTD_C.sI IN (SELECT sI FROM GTD_D WHERE cd BETWEEN "+"'"+startTime+"'"+" AND "+"'"+endTime+"')",[]);
  }

}
