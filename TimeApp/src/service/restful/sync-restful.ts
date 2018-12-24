import { Injectable } from '@angular/core';
import { HTTP } from '@ionic-native/http';
import {AppConfig} from "../../app/app.config";
import {BsRestful} from "./bs-restful";
import {PsModel} from "../../model/ps.model";



/**
 * 日程操作
 */
@Injectable()
export class SyncRestful extends BsRestful{
  constructor(private http: HTTP) {
    super()
  }

  /**
   * 初始化获取字典数据和标签数据
   * @returns {Promise<any>}
   */
  init():Promise<any> {
    return this.bsHttp(this.http,AppConfig.SYNC_INIT_URL, {})
  }
}
