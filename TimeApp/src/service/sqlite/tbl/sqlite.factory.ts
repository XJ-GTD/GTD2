import{Injectable}from'@angular/core';
import {SQLite, SQLiteObject} from "@ionic-native/sqlite";
import {DataConfig} from "../../../app/data.config";
import {BsModel} from "../../../model/out/bs.model";
import {SQLitePorter} from "@ionic-native/sqlite-porter";
import {UtilService} from "../../util-service/util.service";
import {Events} from "ionic-angular";
import {UEntity} from "../../../entity/u.entity";
import {FiEntity} from "../../../entity/fi.entity";
import {SyvEntity} from "../../../entity/syv.entity";

/**
 * create by on 2019/3/5
 */
@Injectable()
export class SQLiteFactory{

  private _database: SQLiteObject;

  private _win: any = window;//window对象

  constructor( private sqlite: SQLite,
               private util: UtilService,
               private sqlitePorter: SQLitePorter,
               private events: Events) { }


  get database(): SQLiteObject {
    return this._database;
  }

  set database(value: SQLiteObject) {
    this._database = value;
  }

  /**
   * 创建数据库
   */
  generateDb(): Promise<BsModel> {
    return new Promise((resolve, reject) => {
      let bs = new BsModel();
      console.log( " start create Db mingWX.db")
      if (DataConfig.IS_MOBILE) {
        this.sqlite.create({
          name: 'mingWX.db',
          location: 'default'
        }).then((db: SQLiteObject) => {
          console.log( " create Db success")
          this._database = db;
          resolve(bs)
        }).catch(e => {
          console.log( " create Db fail：" + e.message)
          this.events.publish('db:create');
          bs.code = 1
          resolve(bs);
        });
      } else {
        //H5数据库存储
        this._database = this._win.openDatabase("mingWX.db", '1.0', 'database', 5 * 1024 * 1024);//声明H5 数据库大小
        console.log( " create H5 Db success")
        resolve(bs)
      }
      //alert('创建数据成功！')
    });
  }

  /**
   * 初始化表数据
   * @param {BsModel} data
   * @returns {Promise<any>}
   */
  initDbData(): Promise<any> {
    return new Promise((resolve, reject) => {
      if(DataConfig.isFirst!=0){
        console.log("-------------------BaseSqlite initData table  data to start ------------------")
        //版本表
        let fi = new FiEntity();
        fi.id = 1;
        fi.firstIn = 1;
        fi.isup = 1;
        //用户表
        let u: UEntity = new UEntity();
        u.uI = this.util.getUuid();
        u.uty = '0';
        let syv = new SyvEntity();
        syv.si=1;
        syv.bv=0;
        syv.fv='0';
        if(DataConfig.IS_MOBILE){
          //手机端
          let sql=fi.isq+u.isq+syv.isq;
          this.importSqlToDb(sql).then(data=>{
            console.log("-------------------BaseSqlite initData  GTD_A and GTD_FI table to data: "+JSON.stringify(data))
            resolve(data)
          }).catch(e=>{
            console.error("------------------BaseSqlite initData to table data: "+e.message);
            reject(e);
          })
        }else{
          //web端
          this.save(u).then(data=>{
            console.log("-------------------BaseSqlite initData GTD_A to table data: "+JSON.stringify(data))
            return this.save(fi);
          }).then(data=>{
            console.log("-------------------BaseSqlite initData GTD_A to table data: "+JSON.stringify(data))
            return this.save(syv);
          }).then(data=>{
            console.log("-------------------BaseSqlite initData GTD_FI to table data: "+JSON.stringify(data))
            resolve(data);
          }).catch(e=>{
            console.error("------------------BaseSqlite createTable: "+e.message)
            reject(e);
          })
        }
      }else{
        console.log("-------------------BaseSqlite initData table data is exsit ------------------")
        let bs = new BsModel();
        resolve(bs);
      }
    })
  }
}
