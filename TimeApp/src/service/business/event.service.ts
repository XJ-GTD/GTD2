import { Injectable } from "@angular/core";
import { BaseService } from "./base.service";
import { SqliteExec } from "../util-service/sqlite.exec";
import { UtilService } from "../util-service/util.service";

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

export class EventData implements CTbl {

}

export class AgendaData implements EventData, EATbl {

}

export class TaskData implements EventData, ETTbl {

}

export class MiniTaskData implements EventData {

}

export enum EventType {
  Agenda: 0,
  Task: 1,
  MiniTask: 2
}
