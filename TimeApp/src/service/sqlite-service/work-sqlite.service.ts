import { Injectable } from '@angular/core';
import {Platform, Events, List} from 'ionic-angular';
import {BaseSqliteService} from "./base-sqlite.service";
import {UEntity} from "../../entity/u.entity";
import {UoModel} from "../../model/out/uo.model";
import {MsEntity} from "../../entity/ms.entity";
import {MbsoModel} from "../../model/out/mbso.model";
import {MbsModel} from "../../model/mbs.model";
import {RcpoModel} from "../../model/out/rcpo.model";


/**
 * 客户端数据库
 *
 * create w on 2018/10/24
 */
@Injectable()
export class WorkSqliteService {

  constructor( private baseSqlite: BaseSqliteService) {

  }

  /**
   * 查询每月事件标识
   * @param ym 格式‘2018-01’
   */
  getMBs(ym):Promise<MbsoModel>{
    let sql='select substr(gd.pD,1,10) ymd,gh.mdn,count(*) ct from GTD_D gd ' +
      'left outer join (select substr(md,1,10) mdn from GTD_H where mt="0" group by substr(md,1,10)) gh on gh.mdn=substr(gd.pD,1,10) ' +
      'where  substr(gd.pD,1,7)="' + ym +'" GROUP BY substr(gd.pD,1,10),gh.mdn'
    return new Promise((resolve, reject) =>{
      let mbso = new MbsoModel();
      this.baseSqlite.executeSql(sql,[]).then(data=>{
        mbso.code=0;
        if(data && data.rows && data.rows.length>0){
          let mbsl = new Array<MbsModel>()
          for(let i=0;i<data.rows.length;i++){
            let mbs = new MbsModel();
            mbs.date=new Date(data.rows.item(i).ymd);
            if(data.rows.item(i).ct>5){
              mbs.im=true;
            }
            if(data.rows.item(i).mdn !=null){
              mbs.iem=true;
            }
            mbsl.push(mbs)
          }
          mbso.bs=mbsl;
        }
        resolve(mbso);
      }).catch(e=>{
        mbso.code=1;
        mbso.message=e.message;
        reject(mbso)
      })
    })
  }

  /**
   * 查询当天事件
   * @param d 'yyyy-MM-dd'
   */
  getOd(d:string,):Promise<RcpoModel>{
      return new Promise((resolve, reject) =>{
        let sql="select substr(pd,12,16) tm,gtdd.* from GTD_D" +
          " gtdd where substr(pd,1,10)='" + d+"'";
        let rcpo = new RcpoModel();
        this.baseSqlite.executeSql(sql,[]).then(data=>{
          rcpo.code=0;
          if(data && data.rows && data.rows.length>0){
            let rcps = new Array<RcpoModel>()
            for(let i=0;i<data.rows.length;i++){
              let rcp = new RcpoModel();
              rcps.push(data.rows.item(i))
            }
            rcpo.sjl = rcps;
          }
          resolve(rcpo);
        }).catch(e=>{
          rcpo.code=1;
          rcpo.message=e.message;
          reject(rcpo)
        })
      })
  }
  test() {
    let ms = new MsEntity();
    ms.mn='test';
    ms.md='2018-11-18 20:12';
    ms.mt='0';
    //插入消息
    this.baseSqlite.save(ms).then(data=>{
      console.log(data);
    })
    let sqlStr = "INSERT INTO GTD_D(pI,son,pd,uI) " +
      "VALUES ('24314','12424','2018-11-18 20:12','123458')";
    this.baseSqlite.executeSql(sqlStr, []).then(data => {
      console.log(data)
    }).catch(e => {
      console.log(e)
    })

    let sqlStr3 = "INSERT INTO GTD_D(pI,son,pd,uI) " +
      "VALUES ('243143','12424','2018-11-17 20:12','123458')";
    this.baseSqlite.executeSql(sqlStr3,[]).then(data=>{
      console.log(data)
    }).catch(e=>{
      console.log(e)
    })

    let sqlStr4 = "INSERT INTO GTD_D(pI,son,pd,uI) " +
      "VALUES ('243144','12424','2018-11-15 20:12','123458')";
    this.baseSqlite.executeSql(sqlStr4,[]).then(data=>{
      console.log(data)
    }).catch(e=>{
      console.log(e)
    })

    let sqlStr5 = "INSERT INTO GTD_D(pI,son,pd,uI) " +
      "VALUES ('243145','12424','2018-11-22 20:12','123458')";
    this.baseSqlite.executeSql(sqlStr5,[]).then(data=>{
      console.log(data)
    }).catch(e=>{
      console.log(e)
    })
  }
  // select(u:UEntity,outParam:UoModel): Promise<any>{
  //   return new Promise((resolve, reject) =>{
  //     // if(u.uI != null){
  //     let sql='select * from GTD_A where 1=1';
  //
  //     if(u.uI != null){
  //       sql=sql+'and uI="'+u.uI+'"';
  //     }
  //     this.baseSqlite.executeSql(sql,[])
  //       .then(data=>{
  //         resolve(data);
  //         // if(data&& data.rows && data.rows.length>0){
  //         //   outParam.ct=data.rows.length;
  //         //   let d=new Array<UEntity>()
  //         //   for(let i=0;i<data.rows.length;i++){
  //         //     d[i]=data.rows.item(i);
  //         //   }
  //         //   outParam.us=d;
  //         //   resolve(outParam);
  //         // }else{
  //         //   outParam.ct=0;
  //         //   resolve(outParam);
  //         // }
  //       }).catch(e=>{
  //       reject(e);
  //     })
  //     // }else{
  //     //   reject('入参不能为空！')
  //     // }
  //   })
  // }


}
