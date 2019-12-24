import { Injectable } from "@angular/core";
import { BaseService } from "./base.service";

import { EmitService } from "../util-service/emit.service";
import {  EventService } from "./event.service";
import { CalendarService } from "./calendar.service";
import { MemoService } from "./memo.service";
import { ScheduleRemindService } from "./remind.service";
import {AnnotationService} from "./annotation.service";

@Injectable()
export class EffectService extends BaseService {
  constructor(private eventService: EventService,
              private memoService: MemoService,
              private remindService: ScheduleRemindService,
              private emitService: EmitService,
              private calendarService: CalendarService,
              private annotationService : AnnotationService) {
    super();
  }

  async syncStart() {

    await this.calendarService.syncPrivatePlans();    // 同步自定义日历
    await this.eventService.syncAttachments();        // 同步附件
    await this.calendarService.syncPlanItems();       // 同步日历项
    await this.eventService.syncAgendas();            // 同步日程
    await this.memoService.syncMemos();               // 同步备忘
    await this.annotationService.syncAnnotation();   // 同步@信息
    await this.remindService.syncScheduledReminds();  // 同步未来48小时的提醒

    return ;
  }

  async syncInitial() {
     await this.calendarService.requestInitialData();  // 请求拉取服务器最新日历相关数据
  }

  async syncCompareInitial() {
     await this.calendarService.requestDeviceDiffData();    // 请求拉取客户端不一致数据
  }

  /**
   * 注册同步数据事件
   **/
  registerSyncEvents() {
    let online = this.emitService.register("on.network.connected", () => {
      online.unsubscribe();
      this.syncStart().then(() => {
        this.registerSyncEvents();
      });
    });
  }
}
