import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { Injectable } from '@angular/core';
import { Platform , Events } from 'ionic-angular';
import { SQLitePorter } from '@ionic-native/sqlite-porter';
import * as moment from "moment";
import {UEntity} from "../../entity/u.entity";
import {RcEntity} from "../../entity/rc.entity";
import {RcpEntity} from "../../entity/rcp.entity";
import {RuEntity} from "../../entity/ru.entity";
import {LbEntity} from "../../entity/lb.entity";
import {ReEntity} from "../../entity/re.entity";
import {StEntity} from "../../entity/st.entity";
import {ZtEntity} from "../../entity/zt.entity";
import {ZtdEntity} from "../../entity/ztd.entity";
import {MsEntity} from "../../entity/ms.entity";
import {BsModel} from "../../model/out/bs.model";

/**
 * 客户端数据库
 *
 * create w on 2018/10/24
 */
@Injectable()
export class BaseSqliteService {

  database: SQLiteObject;
  win: any = window;//window对象
  constructor( private platform: Platform,
               private sqlite: SQLite,
               private sqlitePorter: SQLitePorter,
               private events: Events) { }
  /**
   * 创建数据库
   */
  createDb() {
    if (this.isMobile()) {
      this.sqlite.create({
        name: 'data.db',
        location: 'default'
      })
        .then((db: SQLiteObject) => {
          this.database = db;
          this.createTable();
        })
        .catch(e => {
          alert(e.toString());
          this.events.publish('db:create');
        });
    } else {
      //H5数据库存储
      this.database = this.win.openDatabase("data.db", '1.0', 'database', 5 * 1024 * 1024);//声明H5 数据库大小
      this.createTable();
    }
  }

  /**
   * 创建表
   */
  async createTable() {
    //可能存在多个执行创建表语句，只需最后一个使用await
    //this.executeSql('DROP TABLE GTD_ACCOUNT',[]);
    //创建用户基本信息表
    let ue=new UEntity();
    this.executeSql(ue.csq,[]).catch(e=>{
      console.log('GTD_A:'+e.toString());
    })
    //创建日程表
    let rc = new RcEntity();
    this.executeSql(rc.csq,[]).catch(e=>{
      console.log('GTD_C:'+e.toString());
    })

    //创建日程参与人表
    let rcp = new RcpEntity();
    this.executeSql(rcp.csq,[]).catch(e=>{
      console.log('GTD_ACCOUNT:'+e.toString());
    })
    //授权联系人表
    let ru = new RuEntity();
    this.executeSql(ru.csq,[]).catch(e=>{
      console.log('GTD_B:'+e.toString());
    })
    //标签表
    let lb = new LbEntity();
    this.executeSql(lb.csq,[]).catch(e=>{
      console.log('GTD_F:'+e.toString());
    })

    // 提醒时间表
    let re = new ReEntity();
    this.executeSql(re.csq,[]).catch(e=>{
      console.log('GTD_E:'+e.toString());
    })
    // 系统设置表
    let st = new StEntity();
    this.executeSql(st.csq,[]).catch(e=>{
      console.log('GTD_G:'+e.toString());
    })
    // massage
    let ms = new MsEntity();
    this.executeSql(ms.csq,[]).catch(e=>{
      console.log('GTD_H:'+e.toString());
    })
    // 字典类型表
    let zt = new ZtEntity();
    this.executeSql(zt.csq,[]).catch(e=>{
      console.log('GTD_X:'+e.toString());
    })
    // 字典数据表
    let ztd = new ZtdEntity();
    this.executeSql(ztd.csq,[]).catch(e=>{
      console.log('GTD_Y:'+e.toString());
    })

    let sql = new UEntity().csq+ new RcEntity().csq + new RcpEntity().csq +new RuEntity().csq
                  + new LbEntity().csq+new ReEntity().csq+ new StEntity().csq+ new MsEntity().csq
                  + new ZtEntity().csq+new ZtdEntity().csq;
    //this.importSqlToDb(sql);
  }


  /**
   * 批量语句
   */
  importSqlToDb(sql: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.sqlitePorter.importSqlToDb(this.database, sql)
        .then((count) => {
          console.log('Imported');
          alert("Imported" + count);
          resolve(count);
        })
        .catch((error)=> {
          console.error(error);
          alert(error);
          reject(error)
        });
    });
  }

  /**
   * 执行语句
   */
  executeSql(sql: string, array: Array<any>): Promise<any> {
    return new Promise((resolve, reject) => {
      this.database.transaction(function(tx) {
        tx.executeSql(sql, array,  (tx, res)=>{
          resolve(res);
        }, (tx, err) =>{
          console.log('error: ' + err.message);
          reject(err);
        });
      });

    });
  }


  /**
   * 是否真机环境
   * @return {boolean}
   */
  isMobile():boolean{
    return this.platform.is('mobile') && !this.platform.is('mobileweb');
  }

  /**
   * 保存
   * @param et 对应实体类
   * @returns {Promise<any>}
   */
  save(et:any){
    return this.executeSql(et.isq,[])
  }
  /**
   * 更新
   */
  update(et:any){
    return this.executeSql(et.usq,[])

  }

  /**
   * 删除
   * @param param
   * @returns {Promise<any>}
   */
  delete(et:any){
    return this.executeSql(et.dsq,[])
  }

  /**
   * 根据ID查询
   * @param t
   * @returns {Promise<T>}
   */
  getOne(et:any){
    return this.executeSql(et.qosq,[])
  }

  /**
   * 生成本地测试日历数据
   */
  addRctest(): Promise<any> {
    let sql = "";

    let ii = 1;
    let mo = moment();
    return new Promise((resolve, reject) => {

      while (ii < 3000) {


        mo = mo.add(5, "h");

        sql = sql + "INSERT INTO GTD_D(pI,son,uI) " +
          "VALUES ( '" + mo.format("YYYY-MM-DD hh:mm:ss SSS") + "','加上5个小时');";
        ii += 1;
      }


      mo = moment();
      ii= 0;
      while (ii < 3000) {


        mo = mo.subtract(5, "h");
        sql = sql + "INSERT INTO GTD_D(pI,son,uI) " +
          "VALUES ( '" + mo.format("SSS YYYY-MM-DD hh:mm:ss") + "','减去5个小时');";
        ii += 1;
      }

      this.importSqlToDb(sql,).then((data) => {
        resolve("添加完成，总数据量为：" + ii);
      }).catch((err) => {
          resolve(err.toString());
        }
      )


    })
  }

}
