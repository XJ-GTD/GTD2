import { Injectable } from '@angular/core';
import {BaseSqliteService} from "./base-sqlite.service";
import {RcEntity} from "../../entity/rc.entity";
import {RcpEntity} from "../../entity/rcp.entity";


/**
 * message sqlite
 *
 * create by hjd on 2018/11/23
 */
@Injectable()
export class PlayerSqliteService {
  constructor(private baseSqlite: BaseSqliteService) {}

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
    let sql="select sI,sN,lI,uI,sd,ed from GTD_H where 1=1";
    if(rc.sI!=null){
      sql=sql+' sI="' + rc.sI +'",';
    }
    if(rc.sN!=null){
      sql=sql+' sN="' + rc.sN +'",';
    }
    if(rc.lI!=null){
      sql=sql+' lI="' + rc.lI +'",';
    }
    if(rc.uI!=null){
      sql=sql+' uI="' + rc.uI +'",';
    }
    if(rc.sd!=null){
      sql=sql+' sd="' + rc.sd +'",';
    }
    if(rc.ed!=null){
      sql=sql+' ed="' + rc.ed +'",';
    }
    return this.baseSqlite.executeSql(sql,[]);
  }

  /**
   * 查询日程参与人
   * @param {RcpEntity} rcp
   * @returns {Promise<any>}
   */
  getRcp(rcp:RcpEntity){
    let sql="select pI,sI,son,sa,ps,cd,pd,uI,ib from GTD_H where 1=1";
    if(rcp.pI!=null){
      sql=sql+' pI="' + rcp.pI +'",';
    }
    if(rcp.sI!=null){
      sql=sql+' sI="' + rcp.sI +'",';
    }
    if(rcp.son!=null){
      sql=sql+' son="' + rcp.son +'",';
    }
    if(rcp.sa!=null){
      sql=sql+' sa="' + rcp.sa +'",';
    }
    if(rcp.ps!=null){
      sql=sql+' ps="' + rcp.ps +'",';
    }
    if(rcp.cd!=null){
      sql=sql+' cd="' + rcp.cd +'",';
    }
    if(rcp.pd!=null){
      sql=sql+' pd="' + rcp.pd +'",';
    }
    if(rcp.uI!=null){
      sql=sql+' uI="' + rcp.uI +'",';
    }
    if(rcp.ib!=null){
      sql=sql+' ib="' + rcp.ib +'",';
    }
    return this.baseSqlite.executeSql(sql,[]);
  }



}
