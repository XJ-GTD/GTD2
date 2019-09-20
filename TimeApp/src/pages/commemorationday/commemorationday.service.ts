import {Injectable} from "@angular/core";
import * as moment from "moment";
import {CalendarDay} from "../../components/ion2-calendar";
import { RcInParam, ScdData } from "../../data.mapping";
import {AssistantService} from "../../service/cordova/assistant.service";
import { EventService, TaskData } from "../../service/business/event.service";
import { IsSuccess, SyncDataStatus } from "../../data.enum";
import {UtilService} from "../../service/util-service/util.service";

@Injectable()
export class CommemorationDayService {
  constructor(private util: UtilService,
              private eventService: EventService,
              private assistantService: AssistantService) {
    moment.locale('zh-cn');
  }
}
