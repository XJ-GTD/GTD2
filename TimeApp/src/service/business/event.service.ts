import { Injectable } from "@angular/core";
import { BaseService } from "./base.service";
import { SqliteExec } from "../util-service/sqlite.exec";
import { UtilService } from "../util-service/util.service";
import { EvTbl } from "../sqlite/tbl/ev.tbl";
import { TTbl } from "../sqlite/tbl/t.tbl";
import { CaTbl } from "../sqlite/tbl/ca.tbl";

@Injectable()
export class EventService extends BaseService {
  constructor(private sqlExce: SqliteExec,
              private util: UtilService) {
    super();
  }
  saveAgenda() {}
  saveTask() {}
  saveMiniTask() {}
  updateEventPlan() {}
  updateEventRemind() {}
  updateEventRepeat() {}
  removeEvent() {}
  finishTask() {}
  sendEvent() {}
  receivedEvent() {}
  acceptReceivedEvent() {}
  rejectReceivedEvent() {}
  syncEvent() {}
  syncEvents() {}
  fetchPagedTasks() {}
  fetchPagedCompletedTasks() {}
  fetchPagedUncompletedTasks() {}
  backup() {}
  recovery() {}
}

export interface EventData extends EvTbl {

}

export interface AgendaData extends EventData, CaTbl {

}

export interface TaskData extends EventData, TTbl {

}

export interface MiniTaskData extends EventData {

}

export enum EventType {
  Agenda = 0,
  Task = 1,
  MiniTask = 2
}
