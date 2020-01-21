import {Injectable} from "@angular/core";
import * as moment from "moment";
import {AssistantService} from "../../service/cordova/assistant.service";
import { EventService, TaskData } from "../../service/business/event.service";
import { IsSuccess, SyncDataStatus } from "../../data.enum";
import {UtilService} from "../../service/util-service/util.service";

@Injectable()
export class DoService {
  constructor(private util: UtilService,
              private eventService: EventService,
              private assistantService: AssistantService) {
    moment.locale('zh-cn');
  }

  async createTestDatas() {
    //创建任务
    let task: TaskData = {} as TaskData;
    task.evn = "冥王星三期";
    task.evd = "2019/06/01";
    task = await this.eventService.saveTask(task);

    let subtask1: TaskData = {} as TaskData;
    subtask1.evn = "设计";
    subtask1.evd = "2019/06/02";
    subtask1.rtevi = task.evi;
    subtask1 = await this.eventService.saveTask(subtask1);

    let subtask2: TaskData = {} as TaskData;
    subtask2.evn = "开发";
    subtask2.evd = "2019/06/03";
    subtask2.rtevi = task.evi;
    subtask2 = await this.eventService.saveTask(subtask2);

    let subtask3: TaskData = {} as TaskData;
    subtask3.evn = "测试";
    subtask3.evd = "2019/06/04";
    subtask3.rtevi = task.evi;
    subtask3 = await this.eventService.saveTask(subtask3);

    let subtask1_1: TaskData = {} as TaskData;
    subtask1_1.evn = "画面UI设计";
    subtask1_1.evd = "2019/06/05";
    subtask1_1.rtevi = subtask1.evi;
    subtask1_1.cs = IsSuccess.success;
    subtask1_1 = await this.eventService.saveTask(subtask1_1);

    let subtask1_1_1: TaskData = {} as TaskData;
    subtask1_1_1.evn = "画面首页设计";
    subtask1_1_1.evd = "2019/06/06";
    subtask1_1_1.rtevi = subtask1_1.evi;
    subtask1_1_1.cs = IsSuccess.success;
    subtask1_1_1 = await this.eventService.saveTask(subtask1_1_1);

    let subtask1_1_2: TaskData = {} as TaskData;
    subtask1_1_2.evn = "画面待处理一览设计";
    subtask1_1_2.evd = "2019/06/07";
    subtask1_1_2.rtevi = subtask1_1.evi;
    subtask1_1_2.cs = IsSuccess.success;
    subtask1_1_2 = await this.eventService.saveTask(subtask1_1_2);

    let subtask1_1_3: TaskData = {} as TaskData;
    subtask1_1_3.evn = "画面新建任务设计";
    subtask1_1_3.evd = "2019/06/08";
    subtask1_1_3.rtevi = subtask1_1.evi;
    subtask1_1_3.cs = IsSuccess.success;
    subtask1_1_3 = await this.eventService.saveTask(subtask1_1_3);

    let subtask1_1_4: TaskData = {} as TaskData;
    subtask1_1_4.evn = "画面新建日程设计";
    subtask1_1_4.evd = "2019/06/09";
    subtask1_1_4.rtevi = subtask1_1.evi;
    subtask1_1_4.cs = IsSuccess.success;
    subtask1_1_4 = await this.eventService.saveTask(subtask1_1_4);

    let subtask1_1_5: TaskData = {} as TaskData;
    subtask1_1_5.evn = "画面新建日程设计";
    subtask1_1_5.evd = "2019/06/10";
    subtask1_1_5.rtevi = subtask1_1.evi;
    subtask1_1_5.cs = IsSuccess.success;
    subtask1_1_5 = await this.eventService.saveTask(subtask1_1_5);

    let subtask1_1_6: TaskData = {} as TaskData;
    subtask1_1_6.evn = "画面新建日历项设计";
    subtask1_1_6.evd = "2019/08/30";
    subtask1_1_6.rtevi = subtask1_1.evi;
    subtask1_1_6 = await this.eventService.saveTask(subtask1_1_6);

    let share: TaskData = {} as TaskData;
    Object.assign(share, subtask1_1_6);

    share.evi = this.util.getUuid();
    share.evn = "画面任务一览设计";
    share.ui = "13564242673";
    await this.eventService.acceptReceivedTask(share, SyncDataStatus.UnDeleted);

    let subtask1_2: TaskData = {} as TaskData;
    subtask1_2.evn = "前端服务设计";
    subtask1_2.evd = "2019/06/06";
    subtask1_2.rtevi = subtask1.evi;
    subtask1_2.cs = IsSuccess.success;
    subtask1_2 = await this.eventService.saveTask(subtask1_2);

    let subtask1_3: TaskData = {} as TaskData;
    subtask1_3.evn = "后端云服务设计";
    subtask1_3.evd = "2019/06/07";
    subtask1_3.rtevi = subtask1.evi;
    subtask1_3 = await this.eventService.saveTask(subtask1_3);

    let subtask2_1: TaskData = {} as TaskData;
    subtask2_1.evn = "页面UI开发";
    subtask2_1.evd = "2019/09/01";
    subtask2_1.rtevi = subtask2.evi;
    subtask2_1 = await this.eventService.saveTask(subtask2_1);

    let subtask2_2: TaskData = {} as TaskData;
    subtask2_2.evn = "后端云服务开发";
    subtask2_2.evd = "2019/09/11";
    subtask2_2.rtevi = subtask2.evi;
    subtask2_2 = await this.eventService.saveTask(subtask2_2);

    let subtask2_3: TaskData = {} as TaskData;
    subtask2_3.evn = "前端服务开发";
    subtask2_3.evd = "2019/08/18";
    subtask2_3.rtevi = subtask2.evi;
    subtask2_3.cs = IsSuccess.success;
    subtask2_3 = await this.eventService.saveTask(subtask2_3);
  }

  /**
   * 显示选中日期对应类型
   * @param {string} day 格式（YYYY-MM-DD）
   * @returns {string}
   */
  private countDay(day: number): string {
    let date = moment(day);
    let str = '今天';
    let nowDate = moment(moment(new Date()).format("YYYY/MM/DD"));
    let days = date.diff(nowDate, 'days');
    let months = date.diff(nowDate, 'months');
    let years = date.diff(nowDate, 'years');
    if (years > 0) {
      str = years + '年后'
    } else if (years <= -1) {
      str = Math.abs(years) + '年前'
    } else if (months > 0) {
      str = months + '月后';
    } else if (months < 0) {
      str = Math.abs(months) + '月前'
    } else if (days == 0) {
      str = '今天';
    } else if (days == 1) {
      str = '明天'
    } else if (days == 2) {
      str = '后天'
    } else if (days >= 3) {
      str = days - 1 + '天后'
    } else if (days == -1) {
      str = '昨天'
    } else if (days == -2) {
      str = '前天'
    } else if (days <= -3) {
      str = Math.abs(days) - 1 + '天前'
    }
    return str;
  }

}
