import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { Injectable } from '@angular/core';
import { Platform , Events } from 'ionic-angular';
import { SQLitePorter } from '@ionic-native/sqlite-porter';
import * as moment from "moment";
import {UModel} from "../../entity/u.model";


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
      'LOGIN_STATE VARCHAR(20))',[]
      ).catch(e=>{
      console.log('GTD_ACCOUNT:'+e.toString());
    })
    //创建用户基本信息表
    let usql=new UModel().csq;
    //alert(usql);
    this.executeSql(usql,[]).catch(e=>{
      console.log('GTD_A:'+e.toString());
    })
    //创建日程表
    this.executeSql('CREATE TABLE IF NOT EXISTS GTD_C(scheduleId VARCHAR(64) PRIMARY KEY, ' +
      'scheduleName VARCHAR(100),' +
      'scheduleStartTime VARCHAR(20),' +
      'scheduleDeadLine VARCHAR(20),' +
      'labelId VARCHAR(64))',[]).catch(e=>{
      console.log('GTD_C:'+e.toString());
    })

    //创建日程参与人表
    this.executeSql('CREATE TABLE IF NOT EXISTS GTD_D(playersId VARCHAR(64) PRIMARY KEY, ' +
      'scheduleId VARCHAR(100),' +
      'scheduleOtherName VARCHAR(200),scheduleAuth VARCHAR(2),' +
      'playersFinishDate VARCHAR(20),playersStatus VARCHAR(2),' +
      'userId VARCHAR(100))',[]).catch(e=>{
      console.log('GTD_ACCOUNT:'+e.toString());
    })
    this.executeSql("select substr(playersFinishDate,1,10) finishDate,count(*) numL from GTD_D " +
      "GROUP BY substr(playersFinishDate,1,10) ",[]).then(data=>{
      //alert(data.rows.length);
      //alert(data.rows.item(0).finishDate +","+data.rows.item(0).numL);
    }).catch(e=>{
      console.log("GTD_D->:"+e);
    })
    //联系人表
    this.executeSql('CREATE TABLE IF NOT EXISTS GTD_B(bpkId VARCHAR(64) PRIMARY KEY, ' +
      'relaterId VARCHAR(100),' +
      'relaterName VARCHAR(20),relaterContact VARCHAR(20),' +
      'relaterOtherName VARCHAR(20),relaterFlag VARCHAR(2),' +
      'relaterM VARCHAR(10))',[]).catch(e=>{
      console.log('GTD_B:'+e.toString());
    })
    //标签表
    this.executeSql('CREATE TABLE IF NOT EXISTS GTD_F(labelId VARCHAR(64) PRIMARY KEY, ' +
      'labelName VARCHAR(100),' +
      'labelType VARCHAR(20),' +
      'labelTable VARCHAR(20))',[]).catch(e=>{
      console.log('GTD_F:'+e.toString());
    })

    // 提醒时间表
    this.executeSql('CREATE TABLE IF NOT EXISTS GTD_E(remindId VARCHAR(64) PRIMARY KEY, ' +
      'playersId VARCHAR(100),' +
      'remindDate VARCHAR(20))',[]).catch(e=>{
      console.log('GTD_E:'+e.toString());
    })
    // message表
    this.executeSql('CREATE TABLE IF NOT EXISTS GTD_H(messageId VARCHAR(64) PRIMARY KEY, ' +
      'messageName VARCHAR(100),' +
      'messageType VARCHAR(20))',[]).catch(e=>{
      console.log('GTD_H:'+e.toString());
    })
    // 系统设置表
    this.executeSql('CREATE TABLE IF NOT EXISTS GTD_G(systemId VARCHAR(64) PRIMARY KEY, ' +
      'systemName VARCHAR(100),' +
      'systemStatus VARCHAR(20),systemType VARCHAR(20))',[]).catch(e=>{
      console.log('GTD_H:'+e.toString());
    })

    // 字典类型表
    this.executeSql('CREATE TABLE IF NOT EXISTS GTD_X(dictValue VARCHAR(64) PRIMARY KEY,' +
      'dictName VARCHAR(100))',[]).catch(e=>{
      console.log('GTD_H:'+e.toString());
    })
    // 字典数据表
    this.executeSql('CREATE TABLE IF NOT EXISTS GTD_Y(dictValue VARCHAR(64) not null,' +
      'dictDataName VARCHAR(100),dictDataValue VARCHAR(20) not null)',[]).catch(e=>{
      console.log('GTD_Y:'+e.toString());
    })
    await this.executeSql('CREATE TABLE IF NOT EXISTS remindMaster(remind_id INTEGER PRIMARY KEY AUTOINCREMENT,' +
      'user_id TEXT,state TEXT , content TEXT,remind_time TEXT,create_time TEXT)',[]);

    let sql = "";
    sql = 'CREATE TABLE IF NOT EXISTS GTD_ACCOUNT(ACCOUNT_MOBILE VARCHAR(20) PRIMARY KEY, ' +
      'ACCOUNT_TOKEN VARCHAR(100),' +
      'ACCOUNT_NAME VARCHAR(30) NOT NULL,' +
      'ACCOUNT_QUEUE VARCHAR(64) NOT NULL,' +
      'ACCOUNT_UUID VARCHAR(64) NOT NULL,' +
      'USER_ID VARCHAR(20) NOT NULL,' +
      'LOGIN_TIME VARCHAR(20),' +
      'MOBILE_MODEL VARCHAR(50), ' +
      'LOGIN_STATE VARCHAR(20));';
    sql =   sql + 'CREATE TABLE IF NOT EXISTS GTD_A(userId VARCHAR(100) PRIMARY KEY, ' +
      'userName VARCHAR(100),idCard VARCHAR(100),' +
      'headImgUrl VARCHAR(200),' +
      'brithday VARCHAR(10),' +
      'userSex VARCHAR(2),' +
      'userContact VARCHAR(20),acountQueue VARCHAR(20),' +
      'userType VARCHAR(2),' +
      'userToken VARCHAR(200));';
    //创建日程表
    sql =   sql + 'CREATE TABLE IF NOT EXISTS GTD_C(scheduleId VARCHAR(64) PRIMARY KEY, ' +
      'scheduleName VARCHAR(100),' +
      'scheduleStartTime VARCHAR(20),' +
      'scheduleDeadLine VARCHAR(20),' +
      'labelId VARCHAR(64));';

    //创建日程参与人表
    sql =   sql + 'CREATE TABLE IF NOT EXISTS GTD_D(playersId VARCHAR(64) PRIMARY KEY, ' +
      'scheduleId VARCHAR(100),' +
      'scheduleOtherName VARCHAR(200),scheduleAuth VARCHAR(2),' +
      'playersFinishDate VARCHAR(20),playersStatus VARCHAR(2),' +
      'userId VARCHAR(100));';
    //联系人表
    sql =   sql + 'CREATE TABLE IF NOT EXISTS GTD_B(bpkId VARCHAR(64) PRIMARY KEY, ' +
      'relaterId VARCHAR(100),' +
      'relaterName VARCHAR(20),relaterContact VARCHAR(20),' +
      'relaterOtherName VARCHAR(20),relaterFlag VARCHAR(2),' +
      'relaterM VARCHAR(10));';
    //标签表
    sql =   sql + 'CREATE TABLE IF NOT EXISTS GTD_F(labelId VARCHAR(64) PRIMARY KEY, ' +
      'labelName VARCHAR(100),' +
      'labelType VARCHAR(20),' +
      'labelTable VARCHAR(20));';

    // 提醒时间表
    sql =   sql + 'CREATE TABLE IF NOT EXISTS GTD_E(remindId VARCHAR(64) PRIMARY KEY, ' +
      'playersId VARCHAR(100),' +
      'remindDate VARCHAR(20));';
    // message表
    sql =   sql + 'CREATE TABLE IF NOT EXISTS GTD_H(messageId VARCHAR(64) PRIMARY KEY, ' +
      'messageName VARCHAR(100),' +
      'messageType VARCHAR(20));';
    // 系统设置表
    sql =   sql + 'CREATE TABLE IF NOT EXISTS GTD_G(systemId VARCHAR(64) PRIMARY KEY, ' +
      'systemName VARCHAR(100),' +
      'systemStatus VARCHAR(20),systemType VARCHAR(20));';

    // 字典类型表
    sql =   sql + 'CREATE TABLE IF NOT EXISTS GTD_X(dictValue VARCHAR(64) PRIMARY KEY, ' +
      'dictName VARCHAR(100));';
    // 字典数据表
    sql =   sql + 'CREATE TABLE IF NOT EXISTS GTD_Y(dictValue VARCHAR(64) not null, ' +
      'dictDataName VARCHAR(100),dictDataValue VARCHAR(20) not null);';
    sql =   sql + 'CREATE TABLE IF NOT EXISTS remindMaster(remind_id INTEGER PRIMARY KEY ' +
      'AUTOINCREMENT,user_id TEXT,state TEXT , content TEXT,remind_time TEXT,create_time TEXT);';
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

  save(param:any){
    return new Promise((resolve, reject) =>{
      this.executeSql(param.isq,[])
        .then(data=>{
          resolve(data);
        }).catch(e=>{
        reject(e);
      })
    });
  }
  /**
   * 更新
   */
  update(param:any){
    return new Promise((resolve, reject) =>{
      this.executeSql(param.usq,[])
        .then(data=>{
          resolve(data);
        }).catch(e=>{
        reject(e);
      })

    });
  }

  /**
   * 删除
   * @param param
   * @returns {Promise<any>}
   */
  delete(param:any){
    return new Promise((resolve, reject) =>{
      this.executeSql(param.dsq,[])
        .then(data=>{
          resolve(data);
        }).catch(e=>{
        reject(e);
      })
    });
  }


  /**
   *判断用户是否存在
   * @param param
   * @returns {Promise<any>}
   */
  userIsExist(sql){
    return this.executeSql('select * from GTD_A'+sql,[])
  }

  /**
   * 保存或添加账户信息
   * @param param
   */
  saveOrUpdateUser(param){
    //先判断用户是否存在
    return new Promise((resolve, reject) => {
      this.userIsExist('where userId='+ param.accountUuid).then(data => {
        //如果存在则更新用户登录状态及TOKEN
        if (!!!!data && !!!!data.rows && data.rows.length > 0) {
          this.executeSql('update GTD_A SET ACCOUNT_QUEUE=? where userId=?',[param.accountQueue,param.userId])
            .catch(e=>{
              reject(e);
              console.log('updateLogin:'+e.toString());
            })
        }else{
          this.executeSql('INSERT INTO GTD_A(userId,userName,accountQueue,userToken) VALUES (?,?,?,?)',
            [param.userId,param.accountName, param.accountQueue, param.accountUuid])
            .then(data => {
              console.log(data);
            })
            .catch(e=>{
              reject(e);
              console.log('saveLogin:'+e.toString());
            })
        }
      }).catch(e=>{
        console.log('saveOrUpdateLogin:'+e.toString());
      })
    })
  }

  /**
   * 添加日程
   * @param param
   */
  addRc(param){
    this.executeSql("INSERT INTO GTD_D(playersId,scheduleOtherName,userId) " +
      "VALUES (?,?,?,?)",[param.playersId,param.scheduleOtherName,param.playersFinishDate,param.userId])
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

        sql = sql + "INSERT INTO GTD_D(playersId,scheduleOtherName) " +
          "VALUES ( '" + mo.format("YYYY-MM-DD hh:mm:ss SSS") + "','加上5个小时');";
        ii += 1;
      }


      mo = moment();
      ii= 0;
      while (ii < 3000) {


        mo = mo.subtract(5, "h");
        sql = sql + "INSERT INTO GTD_D(playersId,scheduleOtherName) " +
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
