import {MQProcess} from "../interface.process";
import {WsContent} from "../model/content.model";
import {DS} from "../model/ws.enum";
import {EmitService} from "../../service/util-service/emit.service";
import {Injectable} from "@angular/core";
import {ProcesRs} from "../model/proces.rs";
import {CalendarService} from "../../service/business/calendar.service";
import {EventService, AgendaData, TaskData, MiniTaskData} from "../../service/business/event.service";
import {MemoService} from "../../service/business/memo.service";
import {DataSyncPara} from "../model/datasync.para";
import {ScdData} from "../../data.mapping";

/**
 * 数据同步
 *
 * create by leonxi on 2019/09/30.
 */
@Injectable()
export class DataSyncProcess implements MQProcess {
  constructor(private emitService: EmitService,
              private calendarService: CalendarService,
              private eventService: EventService,
              private memoService: MemoService) {
  }

  async gowhen(content: WsContent, contextRetMap: Map<string,any>) {
    //process处理符合条件则执行
    if (content.when && content.when !=""){
      let rf :boolean = false;
      try {
        let fun = eval("("+content.when+")");
        rf = fun(content);
      }catch (e){
        rf = false;
      };
      if (!rf){
        return contextRetMap;
      }
    }

    //处理区分
    //本设备请求云端同步成功
    if (content.option == DS.SD) {
      //处理所需要参数
      let dsPara: DataSyncPara = content.parameters;

      if (dsPara.type == "Agenda") {
        this.eventService.acceptSyncAgendas([dsPara.id]);
      }
    }

    //本帐号他设备请求,云端同步成功,本地下载完成同步
    if (content.option == DS.SA) {
      //处理所需要参数
      let dsPara: DataSyncPara = content.parameters;

      if (dsPara.type == "Agenda") {
        this.eventService.receivedAgenda(dsPara.id);
      }
    }

    //他帐号请求,云端同步成功,本地下载完成同步
    if (content.option == DS.OA) {
      //处理所需要参数
      let dsPara: DataSyncPara = content.parameters;

      if (dsPara.type == "Agenda") {
        this.eventService.receivedAgenda(dsPara.id);
      }
    }

    //拉取数据直接保存
    if (content.option == DS.DS) {
      //处理所需要参数
      let dsPara: DataSyncPara = content.parameters;

      if (dsPara.type == "Agenda") {
        let agenda: AgendaData = {} as AgendaData;
        Object.assign(agenda, dsPara.data);

        this.eventService.receivedAgendaData([agenda], convertSyncStatus(dsPara.status));
      }
    }

    return contextRetMap
  }

  private convertSyncStatus(status: string): SyncDataStatus {
    if (status == SyncDataStatus.Deleted) {
      return SyncDataStatus.Deleted;
    }

    if (status == SyncDataStatus.UnDeleted) {
      return SyncDataStatus.UnDeleted;
    }

    return SyncDataStatus.UnDeleted;
  }
}
