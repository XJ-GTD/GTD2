import {Injectable} from '@angular/core';
import {RestfulClient} from "../util-service/restful.client";
import {RestFulHeader, UrlEntity, RestFulConfig} from "../config/restful.config";
import {UtilService} from "../util-service/util.service";
import * as moment from "moment";
import { getSha1SafeforBrowser } from '../../util/crypto-util';
import {DataConfig} from "../config/data.config";

/**
 * 系统
 */
@Injectable()
export class SyncRestful {
  // 预览版
  // private initDataUrl: string = "https://www.guobaa.com/ini/parameters";
  // 内网测试版
  //private initDataUrl: string = "https://www.guobaa.com/ini/parameters?debug=true";
  // 开发版
  //private initDataUrl: string = "https://www.guobaa.com/ini/parameters?tag=mwxing";

  constructor(private request: RestfulClient,
     private config: RestFulConfig,
     private uitl: UtilService) {
  }

  //天气服务 每小时天气预报
  putHourlyWeather(userId: string): Promise<string> {
    return new Promise((resolve, reject) => {
      let task = new TriggerTask();

      task.saName = "任务调度触发器";
      task.saPrefix = "cdc";
      task.taskId = `pluto_${userId}_hourly_weather_notification`;
      task.taskType = "QUARTZ";
      task.taskName = "每小时天气预报";

      let taskRunAt = {
        eventId: "QUARTZ_CRON_1H",
        filters: []
      };

      task.taskRunAt = JSON.stringify(taskRunAt);
      let triggerurl: UrlEntity = this.config.getRestFulUrl("HWT");

      let taskRunWith = {
        url: triggerurl.url,
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

  //事件提醒
  // data {
  //   datatype: "Plan | PlanItem | Agenda | Task | MiniTask | Memo"
  //   datas: [
  //     {
  //        phoneno: "当前用户的手机号码",
  //        id: "数据唯一识别符"
  //     }
  //   ]
  // }
  putScheduledRemind(userId: string, id: string, wd: string, wt: string, data: any, active: boolean): Promise<string> {
    return new Promise((resolve, reject) => {
      // 事件提醒任务注册
      let task = new TriggerTask();

      task.saName = "任务调度触发器";
      task.saPrefix = "cdc";
      task.taskId = `pluto_${userId}_remind_${id}`;
      task.taskType = "QUARTZ";
      task.taskName = "计划事件提醒";

      let choosetime = moment(wd + " " + wt, "YYYY/MM/DD HH:mm");

      let taskRunAt = {
        eventId: (wt.endsWith("0") || wt.endsWith("5"))? "QUARTZ_CRON_5M" : "QUARTZ_CRON_1M",
        filters: [
          {name: "yyyy", value: choosetime.format("YYYY")},
          {name: "MM", value: choosetime.format("MM")},
          {name: "dd", value: choosetime.format("DD")},
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
      let triggerurl: UrlEntity = this.config.getRestFulUrl("SRT");

      let taskRunWith = {
        url: triggerurl.url, // "https://pluto.guobaa.com/cdc/mwxing_scheduled_remind_start/json/trigger"
        payload: {
          userId: userId,
          remind: data
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

  putScheduledMultiReminds(userId: string, reminds: Array<any> = new Array<any>()): Promise<string> {
    return new Promise((resolve, reject) => {
      let multitasks = new TriggerMultiTasks();

      for (let remind of reminds) {
        let id: string = remind.id;
        let wd: string = remind.wd;
        let wt: string = remind.wt;
        let data: any = remind.data;
        let active: boolean = remind.active;

        // 事件提醒任务注册
        let task = new TriggerTask();

        task.saName = "任务调度触发器";
        task.saPrefix = "cdc";
        task.taskId = `pluto_${userId}_remind_${id}`;
        task.taskType = "QUARTZ";
        task.taskName = "计划事件提醒";

        let choosetime = moment(wd + " " + wt, "YYYY/MM/DD HH:mm");

        let taskRunAt = {
          eventId: (wt.endsWith("0") || wt.endsWith("5"))? "QUARTZ_CRON_5M" : "QUARTZ_CRON_1M",
          filters: [
            {name: "yyyy", value: choosetime.format("YYYY")},
            {name: "MM", value: choosetime.format("MM")},
            {name: "dd", value: choosetime.format("DD")},
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
        let triggerurl: UrlEntity = this.config.getRestFulUrl("SRT");

        let taskRunWith = {
          url: triggerurl.url, // "https://pluto.guobaa.com/cdc/mwxing_scheduled_remind_start/json/trigger"
          payload: {
            userId: userId,
            remind: data
          }
        };

        task.taskRunWith = JSON.stringify(taskRunWith);

        multitasks.push(task);
      }

      let url: UrlEntity = this.config.getRestFulUrl("EDMTTS");
      this.request.post(url, multitasks).then(data => {
        //处理返回结果
        resolve(data.data);
      }).catch(error => {
        //处理返回错误
        reject(error);
      })
    });
  }

  //智能提醒 每日简报
  putDailySummary(userId: string, timestamp: number, active: boolean): Promise<string> {
    return new Promise((resolve, reject) => {
      //每日简报任务注册
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

  //智能提醒 项目跟进 - GitHub
  putFollowGitHub(userId: string, secret: string, timestamp: number, active: boolean): Promise<string> {
    return new Promise((resolve, reject) => {
      //每日简报任务注册
      let task = new TriggerTask();
      let observer = getSha1SafeforBrowser(userId);

      task.saName = "任务调度触发器";
      task.saPrefix = "cdc";
      task.taskId = `pluto_${userId}_follow_webhook_github_notification`;
      task.taskType = "WEBHOOK";
      task.taskName = "github webhook";

      // let choosetime = moment(timestamp);

      let taskRunAt = {
        eventId: "WEBHOOK_GITHUB",
        filters: [
          {name: "webhook", value: "github"},
          {name: "observer", value: observer},
          {name: "secret", value: secret}
        ]
      };

      if (!active) {
        taskRunAt.filters.push({
          name: "active", value: "false"
        });
      }

      task.taskRunAt = JSON.stringify(taskRunAt);
      let triggerurl: UrlEntity = this.config.getRestFulUrl("WHK");

      let taskRunWith = {
        url: triggerurl.url, // "https://pluto.guobaa.com/cdc/mwxing_webhook_notification_start/json/trigger"
        payload: {
          userId: userId,
          webhook: 'github',
          observer: observer,
          secret: secret
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

  //智能提醒 项目跟进共享 - GitHub
  putFollowGitHubShare(shareTo: string, identify: string, userId: string, secret: string, timestamp: number, active: boolean): Promise<string> {
    return new Promise((resolve, reject) => {
      //每日简报任务注册
      let task = new TriggerTask();
      let observer = getSha1SafeforBrowser(userId);

      task.saName = "任务调度触发器";
      task.saPrefix = "cdc";
      task.taskId = `pluto_${userId}_shareto_${shareTo}_follow_webhook_github_notification`;
      task.taskType = "WEBHOOK_FORWARD";
      task.taskName = "github webhook";

      // let choosetime = moment(timestamp);

      let taskRunAt = {
        eventId: "WEBHOOK_GITHUB",
        filters: [
          {name: "webhook", value: "github"},
          {name: "observer", value: observer},
          {name: "secret", value: secret},
          {name: "repository", value: identify}
        ]
      };

      if (!active) {
        taskRunAt.filters.push({
          name: "active", value: "false"
        });
      }

      task.taskRunAt = JSON.stringify(taskRunAt);
      let triggerurl: UrlEntity = this.config.getRestFulUrl("WHK");

      let taskRunWith = {
        url: triggerurl.url, // "https://pluto.guobaa.com/cdc/mwxing_webhook_notification_start/json/trigger"
        payload: {
          from: userId,
          userId: shareTo,
          webhook: 'github',
          observer: observer,
          secret: secret
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

  //智能提醒 项目跟进 - Travis CI
  putFollowTravisCI(userId: string, timestamp: number, active: boolean): Promise<string> {
    return new Promise((resolve, reject) => {
      //每日简报任务注册
      let task = new TriggerTask();
      let observer = getSha1SafeforBrowser(userId);

      task.saName = "任务调度触发器";
      task.saPrefix = "cdc";
      task.taskId = `pluto_${userId}_follow_webhook_travisci_notification`;
      task.taskType = "WEBHOOK";
      task.taskName = "travis-ci webhook";

      // let choosetime = moment(timestamp);

      let taskRunAt = {
        eventId: "WEBHOOK_TRAVIS-CI",
        filters: [
          {name: "webhook", value: "travis-ci"},
          {name: "observer", value: observer}
        ]
      };

      if (!active) {
        taskRunAt.filters.push({
          name: "active", value: "false"
        });
      }

      task.taskRunAt = JSON.stringify(taskRunAt);
      let triggerurl: UrlEntity = this.config.getRestFulUrl("WHK");

      let taskRunWith = {
        url: triggerurl.url, // "https://pluto.guobaa.com/cdc/mwxing_webhook_notification_start/json/trigger"
        payload: {
          userId: userId,
          webhook: 'travis-ci',
          observer: observer
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

  //智能提醒 项目跟进 - fir.im
  putFollowFirIM(userId: string, timestamp: number, active: boolean): Promise<string> {
    return new Promise((resolve, reject) => {
      //每日简报任务注册
      let task = new TriggerTask();
      let observer = getSha1SafeforBrowser(userId);

      task.saName = "任务调度触发器";
      task.saPrefix = "cdc";
      task.taskId = `pluto_${userId}_follow_webhook_fir.im_notification`;
      task.taskType = "WEBHOOK";
      task.taskName = "fir.im webhook";

      // let choosetime = moment(timestamp);

      let taskRunAt = {
        eventId: "WEBHOOK_FIR.IM",
        filters: [
          {name: "webhook", value: "fir.im"},
          {name: "observer", value: observer}
        ]
      };

      if (!active) {
        taskRunAt.filters.push({
          name: "active", value: "false"
        });
      }

      task.taskRunAt = JSON.stringify(taskRunAt);
      let triggerurl: UrlEntity = this.config.getRestFulUrl("WHK");

      let taskRunWith = {
        url: triggerurl.url, // "https://pluto.guobaa.com/cdc/mwxing_webhook_notification_start/json/trigger"
        payload: {
          userId: userId,
          webhook: 'fir.im',
          observer: observer
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

  //智能提醒 项目跟进 - fir.im
  putFollowFirIMShare(shareTo: string, identify: string, userId: string, timestamp: number, active: boolean): Promise<string> {
    return new Promise((resolve, reject) => {
      //每日简报任务注册
      let task = new TriggerTask();
      let observer = getSha1SafeforBrowser(userId);

      task.saName = "任务调度触发器";
      task.saPrefix = "cdc";
      task.taskId = `pluto_${userId}_shareto_${shareTo}_follow_webhook_fir.im_notification`;
      task.taskType = "WEBHOOK_FORWARD";
      task.taskName = "fir.im webhook";

      // let choosetime = moment(timestamp);

      let taskRunAt = {
        eventId: "WEBHOOK_FIR.IM",
        filters: [
          {name: "webhook", value: "fir.im"},
          {name: "observer", value: observer},
          {name: "link", value: identify}
        ]
      };

      if (!active) {
        taskRunAt.filters.push({
          name: "active", value: "false"
        });
      }

      task.taskRunAt = JSON.stringify(taskRunAt);
      let triggerurl: UrlEntity = this.config.getRestFulUrl("WHK");

      let taskRunWith = {
        url: triggerurl.url, // "https://pluto.guobaa.com/cdc/mwxing_webhook_notification_start/json/trigger"
        payload: {
          from: userId,
          userId: shareTo,
          webhook: 'fir.im',
          observer: observer
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
      let data: SybcData;
      this.request.specPost(RestFulConfig.INIT_DATA_URL, header, {}).then(reps => {
        data = reps.d;
        resolve(data);
      }).catch(e=>{
        data = new SybcData();
        data.apil = DataConfig.asyncData.apil;
        data.dpfu = DataConfig.asyncData.dpfu;
        data.bipl = DataConfig.asyncData.bipl;
        data.vrs = DataConfig.asyncData.vrs;

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

export class TriggerMultiTasks {
  tasks: Array<TriggerTask> = new Array<TriggerTask>();

  public push(task: TriggerTask) {
    if (task) this.tasks.push(task);
  }
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
  version?:string;
  type?:string;
  desc?: string;
  name?: string;
  value?: string;
  needAnswer?:string;
  tips?:string;
}
