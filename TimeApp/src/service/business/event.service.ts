import { Injectable } from "@angular/core";
import { SqliteExec } from "../util-service/sqlite.exec";
import { UtilService } from "../util-service/util.service";

@Injectable()
export class EventService {
  constructor(private sqlExce: SqliteExec,
              private util: UtilService) {}
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
