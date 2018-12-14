import { Injectable } from '@angular/core';
import { RelmemSqlite } from "./sqlite/relmem-sqlite";
import { RguEntity } from "../entity/rgu.entity";
import { BsModel } from "../model/out/bs.model";
import { RuEntity } from "../entity/ru.entity";
import { RuoModel } from "../model/out/ruo.model";
import { RuModel } from "../model/ru.model";
import { AppConfig } from "../app/app.config";
import { BaseSqlite } from "./sqlite/base-sqlite";
import { UtilService } from "./util-service/util.service";
import { PnRestful } from "./restful/pn-restful";
import { DataConfig } from "../app/data.config";


/**
 * 授权联系人
 */
@Injectable()
export class RelmemService {
  relmemSqlite: RelmemSqlite;
  pnRes:PnRestful;
  data:any;
  constructor(private baseSqlite: BaseSqlite,
              private util:UtilService) {
    this.relmemSqlite = new RelmemSqlite(baseSqlite);
  }


  relMeMinit(){
    let rc = '12345678900'
    let rel='0';
    this.aru('',rc,rc,rc,rel,'0',null)
    let rc1 = '12345678901'
    let rel1='0';
    this.aru('','','',rc1,rel1,'0',null)
    let rc2 = '12345678902'
    let rel2='0';
    this.aru('','','',rc2,rel2,'0',null)
    let rc3 = '12345678903'
    let rel3='0';
    this.aru('','','',rc3,rel3,'0',null)
  }

  /**
   * 添加联系人
   * @param {string} uI 当前登录人ID
   * @param {string} ran 别名
   * @param {string} rN 名称
   * @param {string} rc 联系电话
   * @param {string} rel 0联系人,1群组
   * @param {string} rF 授权标识0未授权1授权
   * @param {Array} qrL Array<RuModel>  群组人员list
   * @returns {Promise<BsModel>}
   */
  aru(uI:string,ran:string,rN:string,rc:string,rel:string,rF:string,qrL:Array<any>):Promise<BsModel>{
    return new Promise((resolve, reject)=>{
      let ru=new RuEntity();
      ru.id=this.util.getUuid();
      ru.ran=ran;
      ru.rN=rN;
      ru.rC=rc;
      ru.rel=rel;
      ru.rF = rF;
      if(ru.rN == null || ru.rN == ''){
        ru.rN=rc;
      }
      if(ru.ran == null || ru.ran == ''){
        ru.ran=rc;
      }
      let base=new BsModel();

      if(rel=='0'){
        //如果是人,先判断服务器是否存在，如果存在则获取联系人信息，如果不存在则添加成本地的
        this.pnRes.su(uI,rc,AppConfig.Token).then(data=>{
          this.data = data;
          if(this.data.code==0){
            ru.rN=this.data.userName;
            ru.ran=this.data.userName;
            ru.hiu=this.data.headImgUrl;
            ru.rI=this.data.uI;
          }
          //添加本地联系人
          this.relmemSqlite.aru(ru).then(data=>{
            base = this.data
            resolve(base)
          }).catch(e=>{
            base.code=DataConfig.ERR_CODE;
            base.message=e.message;
            reject(base);
          })

        }).catch(err => {
          base.message = err.message
          base.code=1
          reject(base)
        })
      }else{
        //如果是群
        this.relmemSqlite.aru(ru).then(data=>{
          if(rel=='1' && qrL != null && qrL.length>0){
            for(let i=0;i<qrL.length;i++){
              this.addRgu(ru.id,qrL[i].id)
            }
          }
          resolve(base);
        }).catch(e=>{
          base.code=DataConfig.ERR_CODE;
          base.message=e.message;
          reject(base);
        })

      }

    })
  }

  /**
   * 更新联系人
   * @param {string} uI 当前登录人ID
   * @param {string} id 更新人UUID
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
        base.code=DataConfig.ERR_CODE;
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
        ruo.code=DataConfig.ERR_CODE;
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
          base.code=DataConfig.ERR_CODE;
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
        ruo.code=DataConfig.ERR_CODE;
        ruo.message=DataConfig.ERR_MESSAGE;
        reject(ruo);
      })
    });
  }
  /**
   * 删除群组人员
   * @param {string} bi 群组主键ID
   * @param {string} id 群成员ID
   * @returns {Promise<BsModel>}
   */
  delRgu(bi:string,id:string):Promise<BsModel>{
    return new Promise((resolve, reject)=>{
      let base=new BsModel();
      this.relmemSqlite.delRgu(bi,id).then(data=>{
        resolve(base);
      }).catch(e=>{
          base.code=1;
          base.message=e.message;
          reject(base);
        })
    })
  }

  /**
   * 删除联系人
   * @param {string} id 群成员ID
   * @returns {Promise<BsModel>}
   */
  delRu(id:string):Promise<BsModel>{
    return new Promise((resolve, reject)=>{
      let base=new BsModel();
      let ru = new RuEntity();
      ru.id = id;
      ru.rel=null;
      this.relmemSqlite.dru(ru).then(data=>{
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
