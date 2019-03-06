import { Injectable } from '@angular/core';
import { HTTP } from '@ionic-native/http';
import {AppConfig} from "../../app/app.config";
import {BsRestful} from "./bs-restful";
import {PsModel} from "../../model/ps.model";
import {DataConfig} from "../../app/data.config";
import {BaseModel} from "../../model/base.model";



/**
 * 日程操作
 */
@Injectable()
export class SyncRestful{
  constructor(private bs: BsRestful) {
  }

  /**
   * 初始化获取字典数据和标签数据
   * @returns {Promise<any>}
   */
  init():Promise<any> {
    return this.bs.post(AppConfig.SYNC_INIT_URL, {})
  }

  /**
   * 初始化获取字典数据和标签数据
   * @returns {Promise<any>}
   */
  loginSync(uI:string,dI:string):Promise<any> {
    return this.bs.post(AppConfig.SYNC_LOGIN_URL, {
      userId:uI,
      deviceId: dI
    })
  }
  /**
   * 定时更新接口
   * @returns {Promise<any>}
   */
  syncTime(uI:string,dI:string,vs:string,sdl:any):Promise<any> {
    return this.bs.post(AppConfig.SYNC_TIME_URL, {
      userId:uI,
      deviceId: dI,
      version:vs,
      syncDataList:sdl
    })
  }

  /**
   * 定时更新接口
   * @returns {Promise<any>}
   */
  syncUpload(uI:string,dI:string,vs:string,sdl:any):Promise<any> {
    return new Promise((resolve, reject) => {
      if(DataConfig.uInfo.uty=='1'){
        this.bs.post(AppConfig.UPLOAD_TIME_URL, {
          userId:uI,
          deviceId: dI,
          version:vs,
          syncDataList:sdl
        }).then(data=>{
          resolve(data);
        }).catch(e=>{
          reject(e);
        })
      }else{
        let bs = new BaseModel();
        resolve(bs);
      }

    })
  }
}
