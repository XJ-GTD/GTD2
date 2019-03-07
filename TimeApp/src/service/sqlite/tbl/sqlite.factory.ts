import {Injectable} from '@angular/core';
import {SQLite, SQLiteObject} from "@ionic-native/sqlite";
import {DataConfig} from "../../../app/data.config";
import {SQLitePorter} from "@ionic-native/sqlite-porter";
import {UtilService} from "../../util-service/util.service";
import {Events} from "ionic-angular";
import {BsModel} from "../../../model/out/bs.model";

/**
 * create by on 2019/3/5
 */
@Injectable()
export class SQLiteFactory {

  private _database: SQLiteObject;

  private _win: any = window;//window对象

  constructor(private sqlite: SQLite,
              private util:UtilService) {
  }


  get database(): SQLiteObject {
    return this._database;
  }

  /**
   * 创建数据库
   */
  generateDb(): Promise<any> {
    return new Promise((resolve, reject) => {
      console.log(" start create Db mingWX.db")
      if (this.util.isMobile()) {
        this.sqlite.create({
          name: 'mingWX.db',
          location: 'default'
        }).then((db: SQLiteObject) => {
          console.log(" create Db success")
          this._database = db;
          resolve()
        }).catch(e => {
          console.log(" create Db fail：" + e.message)
          reject();
        });
      } else {
        //H5数据库存储
        this._database = this._win.openDatabase("mingWX.db", '1.0', 'database', 5 * 1024 * 1024);//声明H5 数据库大小
        console.log(" create H5 Db success");
        resolve()
      }
    });
  }

  /**
   * 创建/更新表
   * @param {string} updateSql 更新SQL
   * @returns {Promise<any>}
   */
  createOrUpdateTable(updateSql:string): Promise<any> {
    return new Promise((resolve, reject) => {
        //判断是否是手机端
        if (DataConfig.IS_MOBILE) {
          // let a = true;
          // if (a) {
          //1先删除表
          let delsql = new UEntity().drsq + new RcEntity().drsq + new RcpEntity().drsq + new RuEntity().drsq
            + new LbEntity().drsq + new ReEntity().drsq + new StEntity().drsq + new MsEntity().drsq
            + new ZtEntity().drsq + new ZtdEntity().drsq + new JhEntity().drsq + new RguEntity().drsq
            + new FiEntity().drsq+new RcboEntity().drsq + new RcbtEntity().drsq + new RcbthEntity().drsq
            + new RcbfEntity().drsq + new RcbfvEntity().drsq + new SyvEntity().drsq + new SyncEntity().drsq;
          //再建表
          this.importSqlToDb(delsql).then(data=>{
            console.log("-------------------BaseSqlite createTable delete table success: "+JSON.stringify(data))
            let insertsql = new UEntity().csq + new RcEntity().csq + new RcpEntity().csq + new RuEntity().csq
              + new LbEntity().csq + new ReEntity().csq + new StEntity().csq + new MsEntity().csq
              + new ZtEntity().csq + new ZtdEntity().csq + new JhEntity().csq + new RguEntity().csq
              + new FiEntity().csq+new RcboEntity().csq+new RcbtEntity().csq + new RcbthEntity().csq
              + new RcbfEntity().csq + new RcbfvEntity().csq + new SyvEntity().csq + new SyncEntity().csq;
            return  this.importSqlToDb(insertsql);
          }).then(data=>{
            console.log("-------------------BaseSqlite createTable success: "+JSON.stringify(data));
            resolve(data);
          }).catch(e=>{
            console.error("------------------BaseSqlite createTable error: "+e.message);
            reject(e);
          })
        } else {
          let str = 'GTD_A;';
          //创建用户
          let ue = new UEntity();
          this.executeSql(ue.csq, []).then(data => {
            //创建日程表
            let rc = new RcEntity();
            str+="GTD_C;";
            return  this.executeSql(rc.csq, []);
          }).then(data=>{
            //创建日程参与人表
            let rcp = new RcpEntity();
            str+="GTD_D;";
            return this.executeSql(rcp.csq, []);
          }).then(data=>{
            //授权联系人表
            let ru = new RuEntity();
            str+="GTD_B;";
            return this.executeSql(ru.csq, []);
          }).then(data=>{
            //群组关联人
            let rgu = new RguEntity();
            str+="GTD_B_X;";
            return this.executeSql(rgu.csq, []);
          }).then(data=>{
            //标签表
            let lb = new LbEntity();
            str+="GTD_F;";
            return this.executeSql(lb.csq, []);
          }).then(data=>{
            // 提醒时间表
            let re = new ReEntity();
            str+="GTD_E;";
            return this.executeSql(re.csq, []);
          }).then(data=>{
            // 系统设置表
            let st = new StEntity();
            str+="GTD_G;";
            return this.executeSql(st.csq, []);
          }).then(data=>{
            // massage
            let ms = new MsEntity();
            str+="GTD_H;";
            return this.executeSql(ms.csq, []);
          }).then(data=>{
            // 字典类型表
            let zt = new ZtEntity();
            str+="GTD_X;";
            return this.executeSql(zt.csq, []);
          }).then(data=>{
            // 字典数据表
            let ztd = new ZtdEntity();
            str+="GTD_Y;";
            return this.executeSql(ztd.csq, []);
          }).then(data=>{
            // 计划表
            let jh = new JhEntity();
            str+="GTD_J_H;";
            return this.executeSql(jh.csq, []);
          }).then(data=>{
            // 版本表
            let fi = new FiEntity();
            str+="GTD_FI";
            return this.executeSql(fi.csq, []);
          })
            .then(data=>{
              return this.executeSql(new RcboEntity().csq, []);
            })
            .then(data=>{
              return this.executeSql(new RcbtEntity().csq, []);
            })
            .then(data=>{
              return this.executeSql(new RcbthEntity().csq, []);
            })
            .then(data=>{
              return this.executeSql(new RcbfEntity().csq, []);
            })
            .then(data=>{
              return this.executeSql(new RcbfvEntity().csq, []);
            })
            .then(data=>{
              return this.executeSql(new SyvEntity().csq, []);
            })
            .then(data=>{
              return this.executeSql(new SyncEntity().csq, []);
            })
            .then(data=>{
              console.log("-------------------BaseSqlite createTable success: "+str);
              resolve(data);
            }).catch(e=>{
            console.error("basesqlite createTable Error : "+e.message);
            reject(e);
          })
        }
      }
    })
  }
}
