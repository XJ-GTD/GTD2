import {Injectable} from '@angular/core';
import {RestfulClient} from "../util-service/restful.client";
import {RestFulHeader, UrlEntity, RestFulConfig} from "../config/restful.config";
import {UtilService} from "../util-service/util.service";
import * as moment from "moment";

/**
 * 系统
 */
@Injectable()
export class SyncRestful {
  // 预览版
  private initDataUrl: string = "https://www.guobaa.com/ini/parameters";
  // 内网测试版
  //private initDataUrl: string = "https://www.guobaa.com/ini/parameters?debug=true";
  // 开发版
  //private initDataUrl: string = "https://www.guobaa.com/ini/parameters?tag=mwxing";

  constructor(private request: RestfulClient,
     private config: RestFulConfig,
     private uitl: UtilService) {
  }

  //智能提醒 每日简报
  putDailySummary(userId: string, timestamp: number, active: boolean): Promise<string> {
    return new Promise((resolve, reject) => {
      let task = new TriggerTask();

      task.saName = "任务调度触发器";
      task.saPrefix = "cdc";
      task.taskId = `pluto_${userId}_daily_summary_notification`;
      task.taskType = "QUARTZ";
      task.taskName = "每日简报";

      let choosetime = moment(timestamp);

      let taskRunAt = {
        eventId: "QUARTZ_CRON_5M",
        filters: [
          {name: "HH", value: choosetime.format("HH")},
          {name: "mm", value: choosetime.format("mm")}
        ]
      };

      if (!active) {
        taskRunAt.filters.push({
          name: "active", value: "false"
        });
      }

      task.taskRunAt = JSON.stringify(taskRunAt);
      let triggerurl: UrlEntity = this.config.getRestFulUrl("DRT");

      let taskRunWith = {
        url: triggerurl.url, // "https://pluto.guobaa.com/cdc/mwxing_daily_summary_start/json/trigger"
        payload: {
          userId: userId
        }
      };

      task.taskRunWith = JSON.stringify(taskRunWith);

      let url: UrlEntity = this.config.getRestFulUrl("EDTTS");
      this.request.post(url, task).then(data => {
        //处理返回结果
        resolve(data.data);
      }).catch(error => {
        //处理返回错误
        reject(error);
      })
    });
  }

  //初始化数据 ID
  initData(): Promise<SybcData> {
    return new Promise((resolve, reject) => {


      let header: RestFulHeader = new RestFulHeader();
      header.di = this.uitl.deviceId();
      header.dt = this.uitl.deviceType();
      //设别类型
      this.request.specPost(RestFulConfig.INIT_DATA_URL, header, {}).then(reps => {
        let data: SybcData = reps.d;
        resolve(data);
      });
    });
  }
}

export class TriggerTask {
  saName:string = ""; //应用名称
  saPrefix:string = ""; //应用前缀   主键
  taskId:string = "";   //任务ID     主键
  taskType:string = ""; //任务类型
  taskName:string = ""; //任务名称
  taskRunAt:string = "{}"; //任务运行条件 json string
  taskRunWith:string = "{}"; //任务运行变量 json string
}

export class SybcData {
  apil: Array<Apil>;
  bipl: Array<Bipl>;
  vrs: Array<Vrs>;
  dpfu:Array<Dpfu>;
}

export class Apil {
  desc: string;
  name: string;
  value: string;
}

export class Bipl {
  plandesc: string;
  planid: string;
  planmark: string;
  planname: string;
}

export class Dpfu {
  desc: string;
  name: string;
  value: string;
}

export class Vrs {
  type:string;
  needAnswer:string;
  desc: string;
  name: string;
  value: string;
  tips:string;
}
