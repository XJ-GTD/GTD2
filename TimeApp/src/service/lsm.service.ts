import { Injectable } from '@angular/core';
import {BaseModel} from "../model/base.model";
import {AuRestful} from "./restful/au-restful";
import {PnRestful} from "./restful/pn-restful";
import {DxRestful} from "./restful/dx-restful";
import {AlertController, LoadingController, NavController, NavParams} from "ionic-angular";
import {HttpClient} from "@angular/common/http";
import {UtilService} from "./util-service/util.service";
import {BsModel} from "../model/out/bs.model";
import {UserSqlite} from "./sqlite/user-sqlite";
import {BaseSqlite} from "./sqlite/base-sqlite";
import {UEntity} from "../entity/u.entity";
import {AppConfig} from "../app/app.config";


/**
 * 登录、注、册短信
 */
@Injectable()
export class LsmService {
  au:AuRestful;
  pn:PnRestful;
  dx:DxRestful;
  userSqlite:UserSqlite;
  data:any
  constructor(private http: HttpClient,
              private loadingCtrl: LoadingController,
              private alertCtrl: AlertController,
              private basesqlite:BaseSqlite,
              private util: UtilService) {
    this.au = new AuRestful(http,util);
    this.pn = new PnRestful(http,util);
    this.dx = new DxRestful(http,util);
    this.userSqlite = new UserSqlite(this.basesqlite)
  }

  /**
   * 注册
   * @param {string} am 手机号
   * @param {string} pw 密码
   * @param {string} ac 验证码
   * @param {string} ui uuid
   */
  sn(am:string,pw:string,ac:string):Promise<BsModel>{
    //生成用户UUID
    let ui = this.util.getUuid();
    return new Promise((resolve, reject) =>{
      let base = new BsModel();
      //查询已存在用户UUID
      this.userSqlite.getUo().then(data=>{
        if(data && data.rows && data.rows.length>0){
            ui = data.rows.item(0).uI;
            //直接注册
            this.pn.sn(am,pw,ac,ui,'')
              .subscribe(sndata=>{
                this.data = sndata;
                base = this.data
                resolve(base)
              },err => {
                base.message = err.message
                base.code=1
                reject(base)
              })
          }else {
            base.message = '本地用户不存在'
            base.code=1
            reject(base)
          }
      }).catch(e=>{
              console.log(""+e.message)
              base.message = e.message
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
      //查询用户
      this.userSqlite.getUo().then(data=>{
        let oldUi = null;
        if(data && data.rows && data.rows.length>0){
          ui = data.rows.item(0).uI;
          oldUi = data.rows.item(0).uI;
        }
        //调用游客登录接口
        this.au.visitor(ui).subscribe(datal=>{
          this.data = datal;
          base = this.data;
          let u = new UEntity();
          u.uI=ui;
          u.aQ=this.data.data.accountQueue
          //用户如果不存在则添加
          if(oldUi==null){
            this.basesqlite.save(u).then(data=>{
              resolve(base);
            }).catch(eu=>{
              base.code=1
              base.message=eu.message
              resolve(base);
            })
          }else{
            //用户如果存在则更新
            this.basesqlite.update(u).then(data=>{
              resolve(base);
            }).catch(eu=>{
              base.code=1
              base.message=eu.message
              resolve(base);
            })
          }
        })
      }).catch(e=>{
        base.message = e.message
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
      //查询用户
      this.userSqlite.getUo().then(data=>{
        let oldUi = null;
        if(data && data.rows && data.rows.length>0){
          let oldUi = data.rows.item(0).uI;
        }
        //登录
        this.au.login(un,pw).subscribe(datal=>{
          this.data = datal;
          base = this.data;
          if(this.data.code ==0){
            let u = new UEntity();
            u.uI=this.data.data.userId;
            u.aQ=this.data.data.accountQueue
            if(u.uT != null && u.uT!=''){
              AppConfig.Token=u.uT;
            }
            //用户如果不存在则添加
            if(oldUi==null){
              this.basesqlite.save(u).then(data=>{
                resolve(base);
              }).catch(eu=>{
                base.code=1
                base.message=eu.message
                resolve(base);
              })
            }else{
              //用户如果存在则更新
              if(oldUi != u.uI){
                u.oUI = oldUi;
              }
              this.basesqlite.update(u).then(data=>{
                resolve(base);
              }).catch(eu=>{
                base.code=1
                base.message=eu.message
                resolve(base);
              })
            }
          }else{
            resolve(base);
          }
        })
      }).catch(e=>{
        base.message = e.message
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
        if(this.data.code==0){
          let u = new UEntity();
          u.uI=this.data.data.userId;
          u.aQ=this.data.data.accountQueue
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
          reject(base)
        }
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
   * @param {string} ui 用户ID
   * @param {string} op 旧密码
   * @param {string} pw 新密码
   */
  upw(ui:string, op:string, pw:string):Promise<BsModel>{
    return new Promise((resolve, reject) =>{
      let base = new BsModel();
      this.pn.upw(ui,op,pw)
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
