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
  //创建用户基本信息表
  this.executeSql('CREATE TABLE IF NOT EXISTS GTD_A(userId VARCHAR(100) PRIMARY KEY, ' +
    'userName VARCHAR(100),idCard VARCHAR(100),' +
    'headImgUrl VARCHAR(200),' +
    'brithday VARCHAR(10),' +
    'userSex VARCHAR(2),' +
    'userContact VARCHAR(20),acountQueue VARCHAR(20),' +
    'userType VARCHAR(2),' +
    'userToken VARCHAR(200))',
    []).catch(e=>{
    console.log('GTD_A:'+e.toString());
  })
  //创建日程表
  this.executeSql('CREATE TABLE IF NOT EXISTS GTD_C(scheduleId VARCHAR(64) PRIMARY KEY, ' +
    'scheduleName VARCHAR(100),' +
    'scheduleStartTime VARCHAR(20),' +
    'scheduleDeadLine VARCHAR(20),' +
    'labelId VARCHAR(64))'
    ,[]).catch(e=>{
    console.log('GTD_C:'+e.toString());
  })

  //创建日程参与人表
  this.executeSql('CREATE TABLE IF NOT EXISTS GTD_D(playersId VARCHAR(64) PRIMARY KEY, ' +
    'scheduleId VARCHAR(100),' +
    'scheduleOtherName VARCHAR(200),scheduleAuth VARCHAR(2),' +
    'playersFinishDate VARCHAR(20),playersStatus VARCHAR(2),' +
    'userId VARCHAR(100))'
    ,[]).catch(e=>{
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
    'relaterM VARCHAR(10))'
    ,[]).catch(e=>{
    console.log('GTD_B:'+e.toString());
  })
  //标签表
  this.executeSql('CREATE TABLE IF NOT EXISTS GTD_F(labelId VARCHAR(64) PRIMARY KEY, ' +
    'labelName VARCHAR(100),' +
    'labelType VARCHAR(20),' +
    'labelTable VARCHAR(20)'
    ,[]).catch(e=>{
    console.log('GTD_F:'+e.toString());
  })

  // 提醒时间表
  this.executeSql('CREATE TABLE IF NOT EXISTS GTD_E(remindId VARCHAR(64) PRIMARY KEY, ' +
    'playersId VARCHAR(100),' +
    'remindDate VARCHAR(20)'
    ,[]).catch(e=>{
    console.log('GTD_E:'+e.toString());
  })
  // message表
  this.executeSql('CREATE TABLE IF NOT EXISTS GTD_H(messageId VARCHAR(64) PRIMARY KEY, ' +
    'messageName VARCHAR(100),' +
    'messageType VARCHAR(20)'
    ,[]).catch(e=>{
    console.log('GTD_H:'+e.toString());
  })
  // 系统设置表
  this.executeSql('CREATE TABLE IF NOT EXISTS GTD_G(systemId VARCHAR(64) PRIMARY KEY, ' +
    'systemName VARCHAR(100),' +
    'systemStatus VARCHAR(20),systemType VARCHAR(20)'
    ,[]).catch(e=>{
    console.log('GTD_H:'+e.toString());
  })

  // 字典类型表
  this.executeSql('CREATE TABLE IF NOT EXISTS GTD_X(dictValue VARCHAR(64) PRIMARY KEY, ' +
    'dictName VARCHAR(100)'
    ,[]).catch(e=>{
    console.log('GTD_H:'+e.toString());
  })
  // 字典数据表
  this.executeSql('CREATE TABLE IF NOT EXISTS GTD_Y(dictValue VARCHAR(64) not null, ' +
    'dictDataName VARCHAR(100),dictDataValue VARCHAR(20) not null'
    ,[]).catch(e=>{
    console.log('GTD_Y:'+e.toString());
  })
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
    this.executeSql("INSERT INTO GTD_D(playersId,scheduleOtherName,playersFinishDate,userId) " +
      "VALUES (?,?,?,?)",[param.playersId,param.scheduleOtherName,param.playersFinishDate,param.userId])
  }
  /**
   * 生成本地测试日历数据
   */

  addRctest(param:Date,minYear:number,i:number){

      return new Promise((resolve, reject) => {
        let year = param.getFullYear();
        let month = param.getMonth()+1;
        let monthStr = month+"";
        if(month<10){
          monthStr = '0'+month;
        }
        let day = param.getDate();
        let dayStr = day +"";
        if(day<10){
          dayStr='0'+day;
        }
        let hours = param.getHours();
        let minutes = param.getMinutes();
        let dateStr=year+"-"+monthStr+"-"+dayStr+" "+hours+":"+minutes;
        let id = dateStr;
        this.executeSql("INSERT INTO GTD_D(playersId,scheduleOtherName,playersFinishDate,userId) " +
          "VALUES (?,?,?,?)",[id,id,dateStr,'1234567890']).then(data=>{
          let nowDate = new Date(param.getTime()-5000*60*60);
          console.log("时间："+param.toLocaleString()+"条数："+i);
          if(nowDate.getFullYear()>minYear){
            i+=1;
            this.addRctest(nowDate,minYear,i)
          }else{

            console.log("添加完成，总数据量为："+i)
            alert("添加完成，总数据量为："+i);
            resolve("添加完成，总数据量为："+i);
          }
        }).catch(e=>{
          alert("报错"+e.message);
          reject(e);

        })
      })

  }


  test(){
    for(let b=1980;b<2020;b++){
      let date= b+"";
      for(let a=1;a<13;a++){
        if(a<10){
          date=date+"-0"+a;
        }else{
          date = date +"-"+ a;
        }
        for (let i=1;i<30;i++){
          if(i<10){
            date = date+"-0" +i +' 08:06';
          }else{
            date=date + "-"+i +' 08:06';
          }
          for (let c=0;c<10;c++){
            let id = date + c;
            this.executeSql("INSERT INTO GTD_D(playersId,scheduleOtherName,playersFinishDate,userId) " +
              "VALUES (?,?,?,?)",[id,id,date,'1234567890'])
          }
        }
      }
    }
    for (let i=5;i<10;i++){
      let date = '2018-11-0'+i +' 10:24'
      let id = 'b'+i;
      this.executeSql("INSERT INTO GTD_D(playersId,scheduleOtherName,playersFinishDate,userId) " +
        "VALUES (?,?,?,?)",[id,id,date,'1234567890'])
    }
    for (let i=5;i<10;i++){
      let date = '2018-11-0'+i +' 10:24'
      let id = 'c'+i;
      this.executeSql("INSERT INTO GTD_D(playersId,scheduleOtherName,playersFinishDate,userId) " +
        "VALUES (?,?,?,?)",[id,id,date,'1234567890'])
    }
    for (let i=5;i<10;i++){
      let date = '2018-11-0'+i +' 10:24'
      let id = 'd'+i;
      this.executeSql("INSERT INTO GTD_D(playersId,scheduleOtherName,playersFinishDate,userId) " +
        "VALUES (?,?,?,?)",[id,id,date,'1234567890'])
    }
    for (let i=5;i<10;i++){
      let date = '2018-11-0'+i +' 10:24'
      let id = 'e'+i;
      this.executeSql("INSERT INTO GTD_D(playersId,scheduleOtherName,playersFinishDate,userId) " +
        "VALUES (?,?,?,?)",[id,id,date,'1234567890'])
    }
    for (let i=5;i<10;i++){
      let date = '2018-11-0'+i +' 10:24'
      let id = 'f'+i;
      this.executeSql("INSERT INTO GTD_D(playersId,scheduleOtherName,playersFinishDate,userId) " +
        "VALUES (?,?,?,?)",[id,id,date,'1234567890'])
    }
    for (let i=18;i<20;i++){
      let date = '2018-11-'+i +' 10:24'
      let id = 'h'+i;
      this.executeSql("INSERT INTO GTD_D(playersId,scheduleOtherName,playersFinishDate,userId) " +
        "VALUES (?,?,?,?)",[id,id,date,'1234567890'])
    }
  }
}
