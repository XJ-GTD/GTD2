import {Injectable} from '@angular/core';
import {SQLite, SQLiteObject} from "@ionic-native/sqlite";
import {UtilService} from "../util-service/util.service";

/**
 * create by on 2019/3/5
 */
@Injectable()
export class SqliteConfig {

  private _database: SQLiteObject;

  private _win: any = window;//window对象

  constructor(private sqlite: SQLite,
              private util: UtilService,) {
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
        this._database = this._win.openDatabase("mingWX.db", '1.0', 'database', 20 * 1024 * 1024);//声明H5 数据库大小
        console.log(" create H5 Db success");
        resolve()
      }
    });
  }
}
