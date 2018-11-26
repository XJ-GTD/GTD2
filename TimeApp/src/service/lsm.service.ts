import { Injectable } from '@angular/core';
import {BaseModel} from "../model/base.model";
import {AuRestfulService} from "./restful-service/au-restful.service";
import {PnRestfulService} from "./restful-service/pn-restful.service";
import {DxRestfulService} from "./restful-service/dx-restful.service";
import {AlertController, LoadingController, NavController, NavParams} from "ionic-angular";
import {HttpClient} from "@angular/common/http";
import {UtilService} from "./util-service/util.service";
import {BsModel} from "../model/out/bs.model";
import {UserSqliteService} from "./sqlite-service/user-sqlite.service";
import {BaseSqliteService} from "./sqlite-service/base-sqlite.service";
import {UEntity} from "../entity/u.entity";


/**
 * 登录、注、册短信
 */
@Injectable()
export class LsmService {
  au:AuRestfulService;
  pn:PnRestfulService;
  dx:DxRestfulService;
  basesqlite:BaseSqliteService;
  data:any
  constructor(private http: HttpClient,
              private loadingCtrl: LoadingController,
              private alertCtrl: AlertController,
              private util: UtilService) {
    this.au = new AuRestfulService(http,util);
    this.pn = new PnRestfulService(http,util);
    this.dx = new DxRestfulService(http,util);
  }

  /**
   * 注册
   * @param {string} am 手机号
   * @param {string} pw 密码
   * @param {string} ac 验证码
   * @param {string} ui uuid
   */
  sn(am:string,pw:string,ac:string,ui:string):Promise<BsModel>{
    return new Promise((resolve, reject) =>{
      let base = new BsModel();
      this.pn.sn(am,pw,ac,ui)
        .subscribe(data=>{
          this.data = data;
          base = this.data
          resolve(base)
        },err => {
          base.message = err.message
          base.code=1
          reject(base)
        })

    })
  }
  /**
   * 游客登录
   */
  visitor() :Promise<BsModel>{
    let ui = this.util.getUuid();
    return new Promise((resolve, reject) =>{
      let base = new BsModel();
      //调用游客登录接口
      this.au.visitor(ui).subscribe(data=>{
        this.data = data;
        base = this.data
        if(this.data.code==0){
            let u = new UEntity();
            u.uI=ui;
            u.aQ=this.data.accountQueue
            //Sqlite插入用户信息
            this.basesqlite.save(u).then(data=>{
              console.log(data)
              resolve(base)
            }).catch(e=>{
              console.log(""+e.message)
              base.message = e.message
              base.code=1
              reject(base)
            })
          }else{
          resolve(base)
          }
        },err => {
          base.message = err.message
          base.code=1
          reject(base)
        })
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
      this.au.login(un,pw)
        .subscribe(data=>{
          this.data = data;
          base = this.data
          if(this.data.code==0){
            let u = new UEntity();
            u.uI=this.data.userId;
            u.aQ=this.data.accountQueue
            //Sqlite插入用户信息
            this.basesqlite.save(u).then(data=>{
              console.log(data)
              resolve(base)
            }).catch(e=>{
              console.log(""+e.message)
              base.message = e.message
              base.code=1
              reject(base)
            })
          }else{
            resolve(base)
          }
      },err => {
          base.message = err.message
          base.code=1
          reject(base)
        })

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
    this.au.ml(um,ac)
      .subscribe(data=>{
        this.data = data;
        base = this.data
        resolve(base)
      },err => {
        base.message = err.message
        base.code=1
        reject(base)
      })

  })
}

  /**
   * 短信验证码
   * @param {string} am 手机号
   */
  sc(am:string):Promise<BsModel> {
    return new Promise((resolve, reject) => {
      let base = new BsModel();
      this.dx.sc(am)
        .subscribe(data => {
          this.data = data;
          base = this.data
          resolve(base)
        }, err => {
          base.message = err.message
          base.code = 1
          reject(base)
        })

    })
  }

  /**
   * 修改密码
   * @param {string} pw 新密码
   */
  upw(pw:string):Promise<BsModel>{
    let ui = this.util.getUuid();
    return new Promise((resolve, reject) =>{
      let base = new BsModel();
      this.pn.upw(ui,pw)
        .subscribe(data=>{
          this.data = data;
          base = this.data
          resolve(base)
        },err => {
          base.message = err.message
          base.code=1
          reject(base)
        })
    })
  }


}
