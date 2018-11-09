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
  //登录账户信息
  //this.executeSql('DROP TABLE GTD_ACCOUNT',[]);
  this.executeSql('CREATE TABLE IF NOT EXISTS GTD_ACCOUNT(ACCOUNT_MOBILE VARCHAR(20) PRIMARY KEY, ' +
    'ACCOUNT_TOKEN VARCHAR(100),' +
    'ACCOUNT_NAME VARCHAR(30) NOT NULL,' +
    'ACCOUNT_QUEUE VARCHAR(64) NOT NULL,' +
    'ACCOUNT_UUID VARCHAR(64) NOT NULL,' +
    'USER_ID VARCHAR(20) NOT NULL,' +
    'LOGIN_TIME VARCHAR(20),' +
    'MOBILE_MODEL VARCHAR(50), ' +
    'LOGIN_STATE VARCHAR(20))',
    []).catch(e=>{
    console.log('GTD_ACCOUNT:'+e.toString());
  })
  // this.executeSql('CREATE TABLE IF NOT EXISTS GTD_ACCOUNT(ACCOUNT_MOBILE VARCHAR(20) PRIMARY KEY, ' +
  //   'ACCOUNT_TOKEN VARCHAR(100),' +
  //   'ACCOUNT_NAME VARCHAR(30) NOT NULL,' +
  //   'ACCOUNT_QUEUE VARCHAR(64) NOT NULL,' +
  //   'ACCOUNT_UUID VARCHAR(64) NOT NULL,' +
  //   'USER_ID int(11) NOT NULL' +
  //   'LOGIN_TIME VARCHAR(20),' +
  //   'MOBILE_MODEL VARCHAR(50) NOT NULL, ' +
  //   'LOGIN_STATE INT(1))',
  //   []);
  // //创建用户表
  // this.executeSql( 'CREATE TABLE GTD_USER (USER_ID  int(11) NOT NULL AUTO_INCREMENT ,' +
  //   'USER_NAME  varchar(15) NOT NULL ,' +
  //   'HEADIMG_URL  varchar(200),' +
  //   'BRITHDAY  datetime NULL DEFAULT NULL,' +
  //   'USER_SEX  int(1) NULL DEFAULT NULL ,' +
  //   'USER_CONTACT  varchar(11) ,' +
  //   'USER_TYPE  int(1) NOT NULL ,' +
  //   'CREATE_ID  int(11) NULL DEFAULT NULL ,' +
  //   'CREATE_DATE  datetime NULL DEFAULT NULL ,' +
  //   'UPDATE_ID  int(11) NULL DEFAULT NULL ,' +
  //   'UPDATE_DATE  datetime NULL DEFAULT NULL ,' +
  //   'PRIMARY KEY (USER_ID)' +
  //   ')', []);
  //创建事件表
  // this.executeSql( 'CREATE TABLE GTD_SCHEDULE(' +
  //   'SCHEDULE_ID  int(11) NOT NULL AUTO_INCREMENT ,' +
  //   'SCHEDULE_NAME  varchar(20) NOT NULL ,' +
  //   'SCHEDULE_STARTTIME  datetime NULL DEFAULT NULL ,' +
  //   'SCHEDULE_DEADLINE  datetime NULL DEFAULT NULL ,' +
  //   'SCHEDULE_REPEAT_TYPE  int(11) NULL DEFAULT NULL COMMENT \'0是单次日程，1是每天重复，2是每周重复，3是每月重复\' ,' +
  //   'SCHEDULE_STATUS  int(11) NULL DEFAULT NULL COMMENT \'0是完成，1是未完成，2是过期\' ,' +
  //   'SCHEDULE_FINISH_DATE  datetime NULL DEFAULT NULL ,' +
  //   'CREATE_ID  int(11) NULL DEFAULT NULL ,' +
  //   'CREATE_DATE  datetime NULL DEFAULT NULL ,' +
  //   'UPDATE_ID  int(11) NULL DEFAULT NULL ,' +
  //   'UPDATE_DATE  datetime NULL DEFAULT NULL ,' +
  //   'PRIMARY KEY (SCHEDULE_ID)\n' +
  //   ')', []);

  await this.executeSql('CREATE TABLE IF NOT EXISTS remindMaster(remind_id INTEGER PRIMARY KEY ' +
    'AUTOINCREMENT,user_id TEXT,state TEXT , content TEXT,remind_time TEXT,create_time TEXT)', []);
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

  /**
   * 根据账号UUID判断用户是否存在
   * @param param
   * @returns {Promise<any>}
   */
  accountIsExist(param){
      return this.executeSql('select * from GTD_ACCOUNT where ACCOUNT_UUID=?',[param])
  }

  /**
   * 保存或添加账户信息
   * @param param
   */
  saveOrUpdateLogin(param){
    //先判断用户是否存在
    this.accountIsExist(param.accountUuid).then(data => {
        //如果存在则更新用户登录状态及TOKEN
        if (!!!!data && !!!!data.rows && data.rows.length > 0) {
          this.executeSql('update GTD_ACCOUNT SET ACCOUNT_QUEUE=? where ACCOUNT_UUID=?',[param.accountQueue,param.accountUuid])
            .catch(e=>{
              console.log('updateLogin:'+e.toString());
            })
        }else{
          this.executeSql('INSERT INTO GTD_ACCOUNT(ACCOUNT_MOBILE,ACCOUNT_NAME,ACCOUNT_QUEUE,ACCOUNT_UUID,USER_ID) VALUES (?,?,?,?,?)',
            [param.accountMobile,param.accountName, param.accountQueue, param.accountUuid,param.userId])
            .then(data => {
              console.log(data);
            })
            .catch(e=>{
              console.log('saveLogin:'+e.toString());
            })
        }
    }).catch(e=>{
      console.log('saveOrUpdateLogin:'+e.toString());
    })
  }

}
