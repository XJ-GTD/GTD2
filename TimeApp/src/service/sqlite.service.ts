import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { Injectable } from '@angular/core';
import { Platform , Events } from 'ionic-angular';


/**
 * 客户端数据库
 *
 * create w on 2018/10/24
 */
@Injectable()
export class SqliteService {

  database: SQLiteObject;
  win_db: any;//H5数据库对象
  win: any = window;//window对象
  constructor( private platform: Platform,
               private sqlite: SQLite,
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
        //创建表
        this.createTable();
        this.events.publish('db:create');
      })
      .catch(e => {
        alert(e.toString());
        this.events.publish('db:create');
      });
  } else {
    //H5数据库存储
    this.win_db = this.win.openDatabase("data.db", '1.0', 'database', 5 * 1024 * 1024);//声明H5 数据库大小
    this.createTable();
    this.events.publish('db:create');
  }
}

/**
 * 创建表
 */
async createTable() {
  // this.querySql('', []);
  //可能存在多个执行创建表语句，只需最后一个使用await
  await this.executeSql('CREATE TABLE remindMaster(remind_id INTEGER PRIMARY KEY AUTOINCREMENT,user_id TEXT,state TEXT , content TEXT,remind_time TEXT,create_time TEXT)', []);
}

/**
 * 执行语句
 */
executeSql(sql: string, array: Array<any>): Promise<any> {
  return new Promise((resolve, reject) => {
    if (this.isMobile()) {
      if (!!!!this.database) {
        this.database.executeSql(sql, array).then((data) => {
          resolve(data);
        }, (err) => {
          reject(err);
          console.log('Unable to execute sql: ' + err);
        });

      } else {
        return new Promise((resolve) => {
          resolve([]);
        });
      }
    } else {
      if (this.win_db) {
        return this.execWebSql(sql, array).then(data => {
          resolve(data);
        }).catch(err => {
          console.log(err);
        });
      }
    }
  });
}
/**
 * 查询H5数据库
 */
execWebSql(sql: string, params: Array<any>): Promise<any> {
  return new Promise((resolve, reject) => {
    try {
      this.win_db.transaction((tx) => {
          tx.executeSql(sql, params,
            (tx, res) => resolve(res),
            (tx, err) => reject(err));
        },
        (err) => reject(err));
    } catch (err) {
      reject(err);
    }
  });
}

/**
 * 是否真机环境
 * @return {boolean}
 */
isMobile():boolean{
  return this.platform.is('mobile') && !this.platform.is('mobileweb');
}


}
