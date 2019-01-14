import { Injectable } from '@angular/core';
import {AuRestful} from "./restful/au-restful";
import {PnRestful} from "./restful/pn-restful";
import {DxRestful} from "./restful/dx-restful";
import {UtilService} from "./util-service/util.service";
import {BsModel} from "../model/out/bs.model";
import {BaseSqlite} from "./sqlite/base-sqlite";
import {UEntity} from "../entity/u.entity";
import {DataConfig} from "../app/data.config";
import {RcEntity} from "../entity/rc.entity";
import {RcpEntity} from "../entity/rcp.entity";
import {SyncService} from "./sync.service";



/**
 * 登录、注册、短信登录、密码修改
 */
@Injectable()
export class LsmService {

  constructor(private au: AuRestful,
              private pn:PnRestful,
              private dx:DxRestful,
              private basesqlite:BaseSqlite,
              private sync : SyncService,
              private util: UtilService) {
  }

  /**
   * 注册
   * @param {string} am 手机号
   * @param {string} pw 密码
   * @param {string} ac 验证码
   * @param {string} ui uuid
   */
  sn(am:string,pw:string,ac:string):Promise<BsModel>{
    return new Promise((resolve, reject) =>{
      let dv = this.util.getDeviceId();
      if(dv && dv != null && dv !=''){
      }else{
        dv='1232321';
      }
      let base = new BsModel();
      console.log("------lsm sn 开始注册--------");
      let ui = '';
      if(DataConfig.uInfo && DataConfig.uInfo.uI) {
        console.log("------lsm sn 请求注册接口 --------");
        ui=DataConfig.uInfo.uI;
            //直接注册
        this.pn.sn(am, pw, ac, ui, '',dv).then(data => {
            console.log("------lsm sn 请求注册接口返回结果："+JSON.stringify(data));
            base = data;
            resolve(base);
          }).catch(e=>{
            base.message = e.message;
            base.code = 1;
            reject(base);
        })
       }else {
        console.error("------lsm sn 注册获取用户ID失败");
        base.code=1;
        base.message="获取用户ID失败";
        reject(base);
      }
     })
  }
  /**
   * 游客登录
   */
  visitor() :Promise<BsModel>{
    return new Promise((resolve, reject) =>{
      let base = new BsModel();
      if(DataConfig.isFirst!=0 ||  DataConfig.uInfo.uT == null ||
        DataConfig.uInfo.uT =='null' ||  DataConfig.uInfo.uT=='') {
        console.log("------lsm visitor 开始游客登录--------");
        let ui = '';
        if (DataConfig.uInfo && DataConfig.uInfo.uI) {
          ui = DataConfig.uInfo.uI;
          console.log("------lsm visitor 获取用户ID：" + ui + ",发起游客登录请求");
          let resData: any = null;
          //调用游客登录接口
          this.au.visitor(ui).then(datal => {
              console.log("------lsm visitor 游客登录请求返回结果：" + JSON.stringify(datal));
              base = datal;
              let u = new UEntity();
              u.uI = ui;
              if (datal.code==0) {
                u.aQ = datal.data.accountQueue;
                u.uT=datal.data.token;

                console.log("------lsm visitor 游客登录成功更新GTD_A消息队列编号：" + u.aQ);
                //赋值消息队列
                DataConfig.uInfo.aQ = u.aQ;
                DataConfig.uInfo.uT=u.uT;
              }
              //用户如果存在则更新
              return this.basesqlite.update(u);
            })
            .then(data => {
              console.log("------lsm visitor 游客登录更新GTD_A返回结果：" + JSON.stringify(data));
              resolve(base);
            })
            .catch(e => {
              base.code = 1;
              base.message = e.message;
              console.log("------lsm visitor 游客登录报错：" + e.message);
              reject(base);
            })
        } else {
          console.error("------lsm visitor 游客登录获取用户ID失败");
          base.code = 1;
          base.message = "获取用户ID失败";
          reject(base);
        }
      }else{
        console.log("------lsm visitor 已游客登录状态--------");
        resolve(base);
      }
    })
  }

  /**
   * 登录
   * @param {string} un
   * @param {string} pw
   */
  login(un:string,pw:string):Promise<BsModel>{
    return new Promise((resolve, reject) =>{
      let base = new BsModel();
      let oldUi = '';
      console.log("------lsm login 开始登录--------");
      if(DataConfig.uInfo && DataConfig.uInfo.uI) {
        oldUi = DataConfig.uInfo.uI;
        console.log("------lsm login 开始登录获取初始用户UI: "+oldUi +",请求登录接口");
        //-------请求登录
        this.au.login(un, pw).then(datal => {
          console.log("------lsm login 登录请求返回结果："+JSON.stringify(datal));
          base = datal;
          if (datal.code == 0) {
            let u = new UEntity();
            u.uI = datal.data.userId;
            u.aQ = datal.data.accountQueue;
            u.biy=datal.data.brithday;
            u.hIU=datal.data.headImg;
            u.iC=datal.data.idCard;
            u.uT=datal.data.token;
            u.uN=datal.data.userName;
            u.uS=datal.data.userSex;
            u.uty="1";
            DataConfig.uInfo=u;
            //用户如果存在则更新
            if (oldUi != u.uI) {
              u.oUI = oldUi;
            }
            console.log("------lsm login 登录请求返回结果code==0，更新用户信息："+JSON.stringify(u));
            return this.basesqlite.update(u);
          }
        })
          .then(data => {
          if(base.code == 0){
            console.log("------lsm login 登录请求返回结果code==0，更新用户信息success："+JSON.stringify(data));
          }else{
            console.error("------lsm login 登录请求返回fail");
          }
          console.log("------lsm login 登录请求返回结果后更新日程用户ID-------");
          let rc=new RcEntity();
          rc.uI=DataConfig.uInfo.uI;
          return this.basesqlite.update(rc);
        })
          .then(data=>{
            let rcp=new RcpEntity();
            rcp.uI=DataConfig.uInfo.uI;
            console.log("------lsm login 登录请求返回结果后更新日程参与人用户ID-------");
            return this.basesqlite.update(rcp);
        }).then(data=>{
          console.log("------lsm login 登录成功请求开始同步服务器数据 -------");
          return this.sync.loginSync();
        }).then(data=>{
            console.log("------lsm login 登录成功请求同步服务器数据结束 -------");
            resolve(base);
          })
          .catch(eu => {
          base.code = 1;
          base.message = eu.message;
          console.error("------lsm login 登录报错：" + eu.message);
          resolve(base);
        })
      }else{
        console.error("------lsm visitor 登录获取用户ID失败");
        base.code=1;
        base.message="用户ID失败";
        reject(base);
      }
    })
  }

  /**
   * 短信登录
   * @param {string} um 手机号
   * @param {string} ac 验证码
   */
  ml(um:string,ac:string) :Promise<BsModel>{
  return new Promise((resolve, reject) =>{
    let base = new BsModel();
    let oldUi = '';
    console.log("------lsm ml 开始短信登录--------");
    if(DataConfig.uInfo && DataConfig.uInfo.uI) {
      oldUi = DataConfig.uInfo.uI;
      console.log("------lsm ml 开始短信登录获取初始用户UI: " + oldUi + ",请求登录接口");
      this.au.ml(um, ac).then(datal => {
        base = datal;
        console.log("------lsm ml 短信登录请求返回结果："+JSON.stringify(datal));
        base = datal;
        if (datal.code == 0) {
          let u = new UEntity();
          u.uI = datal.data.userId;
          u.aQ = datal.data.accountQueue;
          u.biy = datal.data.brithday;
          u.hIU = datal.data.headImg;
          u.iC = datal.data.idCard;
          u.uT = datal.data.token;
          u.uN = datal.data.userName;
          u.uS = datal.data.userSex;
          u.uty = '1';
          DataConfig.uInfo = u;
          //用户如果存在则更新
          if (oldUi != u.uI) {
            u.oUI = oldUi;
          }
          console.log("------lsm login 短信登录请求返回结果code==0，更新用户信息：" + JSON.stringify(u));
          return this.basesqlite.update(u);
        }
      })
        .then(data => {
          if(base.code == 0){
            console.log("------lsm login 短信登录请求返回结果code==0，更新用户信息success："+JSON.stringify(data));
          }else{
            console.error("------lsm login 短信登录请求返回fail");
          }
          resolve(base);
        })
        .catch(eu => {
        base.code = 1;
        base.message = eu.message;
        console.error("------lsm login 短信登录报错：" + eu.message);
        resolve(base);
      })
    }
  })
}

  /**
   * 短信验证码
   * @param {string} am 手机号
   */
  sc(am:string):Promise<BsModel> {
    return new Promise((resolve, reject) => {
      let base = new BsModel();
      console.log("------lsm sc 开始发送短信验证码-------");
      this.dx.sc(am).then(data => {
        console.log("------lsm sc 发送短信验证码返回结果："+JSON.stringify(data));
        base = data;
        resolve(base);
      }).catch(err => {
        base.message = err.message;
        base.code = 1;
        console.error("------lsm sc 短信登录报错：" + err.message);
        reject(base)
      })
    })
  }

  /**
   * 修改密码
   * @param {string} ui 用户ID
   * @param {string} op 旧密码
   * @param {string} pw 新密码
   */
  upw(ui:string, op:string, pw:string):Promise<BsModel>{
    return new Promise((resolve, reject) =>{
      let base = new BsModel();
      this.pn.upw(ui,op,pw).then(data=>{
          base = data;
          resolve(base);
        }).catch(err => {
        base.message = err.message;
        base.code = 1;
        console.error("------lsm sc 短信登录报错：" + err.message);
        reject(base);
      })
    })
  }

}
