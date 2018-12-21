import { Injectable } from '@angular/core';
import { HTTP } from '@ionic-native/http';
import {AppConfig} from "../../app/app.config";
import {BsRestful} from "./bs-restful";
import {PsModel} from "../../model/ps.model";



/**
 * 日程操作
 */
@Injectable()
export class RcRestful extends BsRestful{
  constructor(private http: HTTP) {
    super()
  }

  /**
   * 日程操作
   * @param {string} ui 用户ID
   * @param {string} skt 技能类型
   * @param {string} si 日程事件ID
   * @param {string} sn 日程主题
   * @param {string} st 开始时间
   * @param {string} et 结束时间
   * @param {string} li 标签
   * @param ps 参与人，key为accountMobile和userId
   * @param {string} sts 状态
   * @returns {Promise<any>}
   */
  sc(ui:string,skt:string,si:string,sn:string,
     st:string,et:string,li:string,ps:Array<PsModel>,sts:string):Promise<any> {
    return this.bsHttp(this.http,AppConfig.SCHEDULE_DEAL_URL, {
      userId: ui,
      skillType: skt,
      scheduleId: si,
      scheduleName: sn,
      startTime: st,
      endTime: et,
      label: li,
      players: ps,
      status:sts
    })
  }
}
