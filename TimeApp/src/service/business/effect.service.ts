import { Injectable } from "@angular/core";
import { BaseService } from "./base.service";

import { SqliteExec } from "../util-service/sqlite.exec";
import { UtilService } from "../util-service/util.service";
import { UserConfig } from "../config/user.config";
import { EventData, TaskData, AgendaData, MiniTaskData, EventService, RtJson, TxJson, generateRtJson, generateTxJson } from "./event.service";

@Injectable()
export class EffectService extends BaseService {
  constructor(private eventService: EventService) {
    super();
  }

  async syncStart() {
    await this.eventService.syncAgendas();

    return ;
  }
}
