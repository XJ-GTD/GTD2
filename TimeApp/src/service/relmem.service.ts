import { Injectable } from '@angular/core';
import { RelmemSqlite } from "./sqlite/relmem-sqlite";
import { RguEntity } from "../entity/rgu.entity";
import { BsModel } from "../model/out/bs.model";
import { RuEntity } from "../entity/ru.entity";
import { RuoModel } from "../model/out/ruo.model";
import { RuModel } from "../model/ru.model";
import { BaseSqlite } from "./sqlite/base-sqlite";
import { UtilService } from "./util-service/util.service";
import { PnRestful } from "./restful/pn-restful";
import { DataConfig } from "../app/data.config";


/**
 * 授权联系人
 */
@Injectable()
export class RelmemService {

  constructor(private baseSqlite: BaseSqlite,private pnRes:PnRestful,
              private util:UtilService,private relmemSqlite: RelmemSqlite) {
  }

  /**
   * 联系人搜索
   * @param {string} am 手机号
   */
  su(am:string):Promise<RuModel>{
    return new Promise((resolve, reject) =>{
      let rs = new RuModel();
      console.log("------------ RelmemService su() start user ---------------")
      this.pnRes.su(am).then(data=>{
        rs=data;
        if(data && data.code==0){
          rs.rI=data.data.userId;
          rs.hiu=data.data.headImg;
          rs.rN=data.data.userName;
        }
        console.log("------------ RelmemService su() user end : "+JSON.stringify(data));
        resolve(rs)
      }).catch(e=>{
        alert("user su() Error: " + JSON.stringify(e))
        console.error("RelmemService su() Error: " + JSON.stringify(e))
        rs.code = 1;
        rs.message=e.message;
        reject(rs)
      })
    })
  }
  /**
   * 添加联系人
   * @param {string} uI 当前登录人ID
   * *@param {string} auI 联系人用户ID
   * @param {string} ran 别名
   * @param {string} rN 名称
   * @param {string} rc 联系电话
   * @param {string} rel 0联系人,1群组
   * @param {string} rF 授权标识0未授权1授权
   * @param {Array} qrL Array<RuModel>  群组人员list
   * @returns {Promise<BsModel>}
   */
  aru(uI:string,auI:string,ran:string,rN:string,rc:string,rel:string,hiu:string,rF:string,qrL:Array<RuModel>):Promise<BsModel>{
    return new Promise((resolve, reject)=>{
      let base=new BsModel();
      let ru=new RuEntity();
      ru.id=this.util.getUuid();
      ru.ran=ran;
      ru.rN=rN;
      ru.rC=rc;
      ru.rel=rel;
      ru.rF = rF;
      ru.rI=auI;
      ru.hiu=hiu;
      if(ru.rN == null || ru.rN == ''){
        ru.rN=rc;
      }
      if(ru.ran == null || ru.ran == ''){
        ru.ran=rc;
      }
      if(rel=='0'){
        console.log("--------- 1.RelmemService aru() sqlite add contact start -------------")
        //添加本地联系人
        this.relmemSqlite.aru(ru).then(data=>{
          console.log("--------- 2.RelmemService aru() sqlite add contact end: "+JSON.stringify(data))

         if(auI != null && auI !=''){
           console.log("--------- 3.RelmemService aru() restful add contact start ----------")
           return this.pnRes.au(uI,rc,auI)
         }
        }).then(data=>{
          if(data && data.code && data.code != null){
            console.log("--------- 4.RelmemService aru() restful add contact end: "+JSON.stringify(data))
            base = data;
          }
          resolve(base)
        }).catch(e=>{
          console.log("--------- RelmemService aru() add contact Error: "+JSON.stringify(e))
          base.code=DataConfig.ERR_CODE;
          base.message=e.message;
          reject(base);
        })

      }else{
        //如果是群
        this.relmemSqlite.aru(ru).then(data=>{
          if(rel=='1' && qrL != null && qrL.length>0){
            // for(let i=0;i<qrL.length;i++){
            //   this.addRgu(ru.id,qrL[i].id)
            // }
            this.addRgus(ru.id,qrL)
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
   * 添加多个群组人员
   * @param {string} bi 群组ID
   * @param {Array<RuModel>} rus 关系人ID
   * @returns {Promise<BsModel>}
   */
  addRgus(id:string,rus:Array<RuModel>):Promise<BsModel>{
    return new Promise((resolve, reject)=>{
      let bs = new BsModel();
      if(rus && rus.length>0){
        if(this.baseSqlite.isMobile()){
          let sql = '';
          for(let i=0;i<rus.length;i++){
            sql+='insert into GTD_B_X (bi,bmi) ' + 'values("'+ id+'","'+ rus[i].id+'");'
          }
          console.log("--------- RelmemService addRgus() add Group personnel sql: "+sql)
          this.baseSqlite.importSqlToDb(sql).then(data=>{
            console.log("--------- RelmemService addRgus() restful add Group personnel End: "+JSON.stringify(data))
            resolve(bs)
          }).catch(e=>{
            console.log("--------- RelmemService addRgus() restful add Group personnel Error: "+JSON.stringify(e))
            bs.code=DataConfig.ERR_CODE
            bs.message=e.message;
            reject(bs)
          })
        }else{
          for(let i=0;i<rus.length;i++){
            this.addRgu(id,rus[i].id)
          }
          resolve(bs)
        }
      }else{

      }

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
