import { Injectable } from '@angular/core';
import {RelmemSqliteService} from "./sqlite-service/relmem-sqlite.service";
import {RguEntity} from "../entity/rgu.entity";
import {RguoModel} from "../model/out/rguo.model";
import {BsModel} from "../model/out/bs.model";
import {RuEntity} from "../entity/ru.entity";
import {RuoModel} from "../model/out/ruo.model";
import {RuModel} from "../model/ru.model";
import {AppConfig} from "../app/app.config";
import {BaseSqliteService} from "./sqlite-service/base-sqlite.service";
import {UtilService} from "./util-service/util.service";


/**
 * 授权联系人
 */
@Injectable()
export class RelmemService {
  relmemSqlite: RelmemSqliteService
  constructor(private baseSqlite: BaseSqliteService,
              private util:UtilService) {
    this.relmemSqlite = new RelmemSqliteService(baseSqlite);
  }

  /**
   * 添加联系人
   * @param {string} id 更新人UUID
   * @param {string} ran 别名
   * @param {string} rN 名称
   * @param {string} rc 联系电话
   * @param {string} rel 0联系人,1群组
   * @param {string} rF 授权标识0未授权1授权
   * @param {Array} qrL Array<RuModel>  群组人员list
   * @returns {Promise<BsModel>}
   */
  aru(ran:string,rN:string,rc:string,rel:string,rF:string,qrL:Array<any>):Promise<BsModel>{
    return new Promise((resolve, reject)=>{
      let ru=new RuEntity();
      ru.id=this.util.getUuid();
      ru.ran=ran;
      ru.rN=rN;
      ru.rC=rc;
      ru.rel=rel;
      ru.rF = rF;
      let base=new BsModel();
      this.relmemSqlite.aru(ru).then(data=>{
        //如果是群
        if(rel=='1' && qrL != null && qrL.length>0){
          for(let i=0;i<qrL.length;i++){
            this.addRgu(ru.id,qrL[i].id)
          }
        }
        resolve(base);
      }).catch(e=>{
        base.code=AppConfig.ERR_CODE;
        base.message=e.message;
        reject(base);
      })
    })
  }

  /**
   * 更新联系人
   * @param {string} ran 别名
   * @param {string} rN 名称
   * @param {string} rc 联系电话
   * @param {string} rel 0联系人,1群组
   * @param {string} rF 授权标识0未授权1授权
   * @param {Array} qrL Array<RuModel>  群组人员list
   * @returns {Promise<BsModel>}
   */
  upr(id:string,ran:string,rN:string,rc:string,rel:string,rF:string,qrL:Array<any>):Promise<BsModel>{
    return new Promise((resolve, reject)=>{
      let ru=new RuEntity();
      ru.id=id;
      ru.ran=ran;
      ru.rN=rN;
      ru.rC=rc;
      ru.rel=rel;
      ru.rF = rF;
      let base=new BsModel();
      this.relmemSqlite.uru(ru).then(data=>{
        //如果是群
        if(rel=='1' && qrL != null && qrL.length>0){
          for(let i=0;i<qrL.length;i++){
            this.addRgu(ru.id,qrL[i].id)
          }
        }
        resolve(base);
      }).catch(e=>{
        base.code=AppConfig.ERR_CODE;
        base.message=e.message;
        reject(base);
      })
    })
  }

  /**
   * 查询授权联系人
   * @param {string} id 主键
   * @param {string} ran 别名
   * @param {string} rN 名称
   * @param {string} rC 手机号
   * @param {string} rel  0联系人,1群组
   */
  getrus(id:string,ran:string,rN:string,rC:string,rel:string):Promise<RuoModel>{
    return new Promise((resolve, reject)=>{
      let ruo=new RuoModel();
      this.relmemSqlite.getrus(id,ran,rN,rC,rel).then(data=>{
        let rus = new Array<RuModel>();
        if(data&& data.rows && data.rows.length>0){
          for(let i=0;i<data.rows.length;i++){
            rus.push(data.rows.item(i));
          }
        }
        ruo.us=rus;
        resolve(ruo);
      }).catch(e=>{
        ruo.code=AppConfig.ERR_CODE;
        ruo.message=e.message;
        reject(ruo);
      })
    })
  }


  /**
   * 添加群组人员
   * @param {string} bi 群组ID
   * @param {string} bmi 关系人ID
   * @returns {Promise<BsModel>}
   */
  addRgu(bi:string,bmi:string):Promise<BsModel>{
    return new Promise((resolve, reject)=>{
      let rgu=new RguEntity();
      rgu.bi=bi;
      rgu.bmi=bmi;
      let base=new BsModel();
      this.relmemSqlite.addRgu(rgu).then(data=>{
        resolve(base);
      }).catch(e=>{
          base.code=AppConfig.ERR_CODE;
          base.message=e.message;
          reject(base);
        })
    })
  }
  /**
   * 查询群组人员
   * @param @param {string} id 群组主键
   * @returns {Promise<any>}
   */
  getRgus(id:string):Promise<RuoModel>{
    return new Promise((resolve, reject) =>{
      let ruo=new RuoModel();
      this.relmemSqlite.getRgus(id).then(data=>{
        let rus = new Array<RuModel>();
        if(data&& data.rows && data.rows.length>0){
          for(let i=0;i<data.rows.length;i++){
            rus.push(data.rows.item(i));
          }
        }
        ruo.us=rus;
        resolve(ruo);
      }).catch(e=>{
        ruo.code=AppConfig.ERR_CODE;
        ruo.message=AppConfig.ERR_MESSAGE;
        reject(ruo);
      })
    });
  }
  /**
   * 删除群组人员
   * @param {string} id 群成员ID
   * @returns {Promise<BsModel>}
   */
  delRgu(id:string):Promise<BsModel>{
    return new Promise((resolve, reject)=>{
      let base=new BsModel();
      this.relmemSqlite.delRgu(id).then(data=>{
        resolve(base);
      }).catch(e=>{
          base.code=1;
          base.message=e.message;
          reject(base);
        })
    })
  }


  /**
   * 修改
   * @param {string} bi
   * @param {string} bmi
   * @returns {Promise<BsModel>}
   */
  updateRgu(bi:string,bmi:string):Promise<BsModel>{
    return new Promise((resolve, reject)=>{
      let ru=new RuEntity();

      let base=new BsModel();
      this.relmemSqlite.uru(ru).then(data=>{
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
  }

}
