import{Injectable}from'@angular/core';
import {SQLite, SQLiteObject} from "@ionic-native/sqlite";
import {DataConfig} from "../../../app/data.config";
import {BsModel} from "../../../model/out/bs.model";
import {SQLitePorter} from "@ionic-native/sqlite-porter";
import {UtilService} from "../../util-service/util.service";
import {Events} from "ionic-angular";

/**
 * create by on 2019/3/5
 */
@Injectable()
export class FactionDb{

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
  createDb(): Promise<BsModel> {
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
}
