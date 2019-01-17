import { Injectable } from '@angular/core';
import { AppConfig } from "../../app/app.config";
import { BsRestful } from "./bs-restful";
import { PsModel } from "../../model/ps.model";



/**
 * 日程操作
 */
@Injectable()
export class RcRestful{
  constructor(private bs: BsRestful) {
  }

  /**
   * 日程操作单个
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

    let rcList = new Array<any>();
    let schedule:any = null;
    schedule.scheduleId = si;
    schedule.scheduleName = sn;
    schedule.startTime = st;
    schedule.endTime = et;
    schedule.label = li;
    schedule.players = ps;
    rcList.push(schedule);
    return this.bs.post(AppConfig.SCHEDULE_DEAL_URL, {
      userId: ui,
      skillType: skt,
      scheduleList:rcList,
      status:sts
    })
  }

  /**
   * 日程操作多个
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
  scs(ui:string,skt:string,rcList:Array<any>,sts:string):Promise<any> {
    return this.bs.post(AppConfig.SCHEDULE_DEAL_URL, {
      userId: ui,
      skillType: skt,
      scheduleList:rcList,
      status:sts
    })
  }
}
