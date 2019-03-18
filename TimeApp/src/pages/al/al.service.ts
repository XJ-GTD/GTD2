import {Injectable} from "@angular/core";
import {PermissionsService} from "../../service/cordova/permissions.service";
import {SqliteConfig} from "../../service/config/sqlite.config";
import {SqliteInit} from "../../service/sqlite/sqlite.init";
import {SqliteExec} from "../../service/util-service/sqlite.exec";
import {STbl} from "../../service/sqlite/tbl/s.tbl";
import {UtilService} from "../../service/util-service/util.service";
import {ATbl} from "../../service/sqlite/tbl/a.tbl";
import {RestFulConfig} from "../../service/config/restful.config";
import {WebsocketService} from "../../ws/websocket.service";
import {YTbl} from "../../service/sqlite/tbl/y.tbl";
import * as moment from "moment";
import {CTbl} from "../../service/sqlite/tbl/c.tbl";

@Injectable()
export class AlService {

  constructor(private permissionsService: PermissionsService,
              private sqlLiteConfig: SqliteConfig,
              private sqlLiteInit: SqliteInit,
              private sqlExce: SqliteExec,
              private util: UtilService,
              private restfulConfig : RestFulConfig,
              private wsserivce:WebsocketService) {
  }

//权限申请
  checkAllPermissions(): Promise<AlData> {
    let alData:AlData = new AlData();
    return new Promise((resolve, reject) => {
      this.permissionsService.checkAllPermissions().then(data => {
        alData.text ="权限申请完成"
        resolve(alData);
      });
    });
  }

//创建或连接数据库
  createDB(): Promise<AlData> {
    let alData:AlData = new AlData();
    return new Promise((resolve, reject) => {
      this.sqlLiteConfig.generateDb().then(data => {
        alData.text ="数据库初始化完成"
        resolve(alData);
      })
    })
  }

//判断是否初始化完成
  checkSystem(): Promise<AlData> {
    return new Promise((resolve, reject) => {
      let alData:AlData = new AlData();
      let yTbl: YTbl = new YTbl();
      yTbl.yt = "FI";
      this.sqlExce.getList<STbl>(yTbl).then(data => {

        let stbls:Array<STbl> = data;
        if (stbls.length > 0 && stbls[0].yv == "0"){

          alData.text = "系统完成初始化";
          alData.checkSystem = true;
          resolve(alData);
        }
        else{
          alData.text = "系统开始初始化";
          alData.checkSystem = false;
          resolve(alData);
        }

      }).catch(err => {
        alData.text = "系统开始初始化";
        alData.checkSystem = false;
        resolve(alData);
      })
    })
  }

//创建数据库表,初始化系统数据,初始化数据完成写入
  createSystemData(): Promise<AlData> {

    return new Promise(async (resolve, reject) => {

      let alData:AlData = new AlData();
      alData.text
      //创建表结构
     let count = await this.sqlLiteInit.createTables();

      await this.sqlLiteInit.initData();
     console.log("**************************createTables" + "*************" + count );
        let yTbl: YTbl = new YTbl();
      yTbl.yi = this.util.getUuid();
      yTbl.yt = "FI";
      yTbl.yk = "FI";
      yTbl.yv = "0";
      await this.sqlExce.replaceT(yTbl);

      await this.createTestData();

      console.log("**************************Fi" + "*************写入"  );

      alData.text = "系统初始化完成";
      resolve(alData);
    })
  }

//连接webSocket
  connWebSocket():Promise<AlData>{
    let alData:AlData = new AlData();
    return new Promise((resolve, reject) => {
      // 连接webSocket成功
      this.wsserivce.connect().then(data=>{
        alData.text = "连接webSocket成功";
        resolve(alData);
      })
    });
  }

//系统设置
  setSetting():Promise<AlData>{
    let alData:AlData = new AlData();
    return new Promise(async (resolve, reject) => {
      // TODO 系统设置 restHttps设置 用户偏好设置 用户信息 。。。
      await this.restfulConfig.init()

      await this.sqlLiteInit.initDataSub();
      alData.text = "系统设置完成";
        resolve(alData)

    });
  }

//判断用户是否登陆
  checkUserInfo():Promise<AlData>{
    return new Promise((resolve, reject) => {
      // TODO 判断用户是否登陆
      let aTbl: ATbl = new ATbl();
      let alData:AlData = new AlData();
      this.sqlExce.getList<ATbl>(aTbl).then(data=>{
        if (data.length > 0){
          alData.text = "用户已登录";
          alData.islogin = true;
        }else{
          alData.text = "用户未登录";
          alData.islogin = false;
          resolve(alData);
        }

        resolve(alData);
      }).catch(err=>{
        alData.text = "用户未登录";
        alData.islogin = false;
        resolve(alData);

      });
    });
  }

  createTestData():Promise<boolean>{
    return new Promise<boolean>((resolve, reject) => {
      let start = moment('2019/03/01');
      let sqls = [];
      for (let i=0;i<4000;i++){
        start = moment('2019/03/01');
        let r = this.util.randInt(-90,90);
        let t = this.util.randInt(0,24);
        console.log("start=====" + start.format('YYYY/MM/DD'));

        let d = start.add(r,'d').add(t,'h');
        let c:CTbl = new CTbl();

        c.si = this.util.getUuid();
        c.sn = '这是一个测试日程';
        c.ui = 'slef';
        c.sd = d.format('YYYY/MM/DD');
        c.st =d.format('hh:mm');
        c.ed = '9999/12/31'
        c.et ='24:00'
        c.rt = '0';
        c.sr =c.si
        c.bz ='今天我可能开会';
        sqls.push(c.inT());
      }

      this.sqlExce.batExecSql(sqls).then(c=>{
        console.log("插入数据=====" + c);
        resolve(true);
      })
    })
  }

}

export class AlData{
  text:string;
  checkSystem:boolean;
  islogin:boolean;
}
