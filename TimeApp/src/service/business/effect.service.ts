import { Injectable } from "@angular/core";
import { BaseService } from "./base.service";

import { EmitService } from "../util-service/emit.service";
import { SqliteExec } from "../util-service/sqlite.exec";
import { UtilService } from "../util-service/util.service";
import { UserConfig } from "../config/user.config";
import { EventData, TaskData, AgendaData, MiniTaskData, EventService, RtJson, TxJson, generateRtJson, generateTxJson } from "./event.service";
import { CalendarService } from "./calendar.service";
import { MemoService } from "./memo.service";

@Injectable()
export class EffectService extends BaseService {
  constructor(private eventService: EventService,
              private memoService: MemoService,
              private emitService: EmitService,
              private calendarService: CalendarService) {
    super();
  }

  async syncStart() {

    await this.calendarService.syncPrivatePlans();
    await this.calendarService.syncPlanItems();
    await this.eventService.syncAgendas();
    await this.memoService.syncMemos();

    return ;
  }

  async syncInitial() {
    await this.calendarService.receiveInitialData();
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
