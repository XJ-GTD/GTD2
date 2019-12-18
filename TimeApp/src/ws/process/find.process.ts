import {MQProcess} from "../interface.process";
import {WsContent} from "../model/content.model";
import {Injectable} from "@angular/core";
import {ProcesRs} from "../model/proces.rs";
import {F} from "../model/ws.enum";
import {FindPara} from "../model/find.para";
import {SqliteExec} from "../../service/util-service/sqlite.exec";
import * as moment from "moment";
import {CTbl} from "../../service/sqlite/tbl/c.tbl";
import {FsService} from "../../pages/fs/fs.service";
import {FsData, PageDcData, ScdData} from "../../data.mapping";
import {UtilService} from "../../service/util-service/util.service";
import {WsDataConfig} from "../wsdata.config";
import {BaseProcess} from "./base.process";
import {BTbl} from "../../service/sqlite/tbl/b.tbl";
import {UserConfig} from "../../service/config/user.config";
import {EventService,Member} from "../../service/business/event.service";
import {CalendarService, FindActivityCondition, ActivityData} from "../../service/business/calendar.service";

/**
 * 查询联系人和日历
 *
 * create by wzy on 2018/11/30.
 */
@Injectable()
export class FindProcess extends BaseProcess implements MQProcess {
  constructor(private sqliteExec: SqliteExec, private fsService: FsService,private calendarService:CalendarService,
               private util:UtilService,private eventService:EventService,
              private userConfig: UserConfig) {
    super();
  }

  async gowhen(content: WsContent, contextRetMap: Map<string,any>) {

    //process处理符合条件则执行
    if (content.when && content.when !=""){
      let rf :boolean = false;
      try {
        let fun = eval("("+content.when+")");
        rf = fun(content,contextRetMap);
      }catch (e){
        rf = false;
      }

      if (!rf){
        return contextRetMap;
      }
    }

    //处理所需要参数
    let findData: FindPara = content.parameters;
    //查找联系人
    let fs :Array<FsData> = new Array<FsData>();

    //处理区分
    let scd: Array<ScdData> = new Array<ScdData>();
    let memos: Array<ScdData> = new Array<ScdData>();
    let planitems: Array<ScdData> = new Array<ScdData>();

    if (content.option == F.C) {
      // TODO 增加根据人查询日程
      if (findData.fs && findData.fs.length > 0) {
        fs = this.calendarService.findFriends(findData.fs);
      }
      //TODO 使用findActivities ,该方法联系人尚未完善
      let condition: FindActivityCondition = new FindActivityCondition();

      let finds = findData.scd;
      if (finds.ds)  condition.sd = finds.ds;
      if (finds.ts)  condition.st = finds.ts;
      if (finds.de)  condition.ed = finds.de;
      if (finds.te)  condition.et = finds.te;
      if (finds.ti)  condition.text = finds.ti;
      if (finds.marks)  condition.mark = finds.marks;

      let activities: ActivityData = await this.calendarService.findActivities(condition);

      if (activities.events && activities.events.length > 0) {
        for (let event of activities.events) {
          let escd: ScdData = new ScdData();

          escd.si = event.evi;
          escd.sn = event.evn;
          escd.ui = event.ui;
          escd.sd = event.evd;
          escd.st = event.evt;
          escd.ed = event.evd;
          escd.et = event.evt;

          scd.push(escd);

          if (scd.length >= 5) {
            break;
          }
        }
      }

      if (activities.memos && activities.memos.length > 0) {
        for (let memo of activities.memos) {
          let escd: ScdData = new ScdData();

          escd.si = memo.moi;
          escd.sn = memo.mon;
          escd.sd = memo.sd;

          memos.push(escd);

          if (memos.length >= 5) {
            break;
          }
        }
      }

      if (activities.calendaritems && activities.calendaritems.length > 0) {
        for (let calendaritem of activities.calendaritems) {
          let escd: ScdData = new ScdData();

          escd.si = calendaritem.jti;
          escd.sn = calendaritem.jtn;
          escd.ui = calendaritem.ui;
          escd.sd = calendaritem.sd;
          escd.st = calendaritem.st;

          planitems.push(escd);

          if (planitems.length >= 5) {
            break;
          }
        }
      }
    }

    //增加排序处理
    if (scd && scd.length > 0) {
      scd.sort((a, b) => {
        let evda: string = a.sd;
        let evta: string = a.st;
        let evdb: string = b.sd;
        let evtb: string = b.st;

        return moment(evda + " " + evta, "YYYY/MM/DD HH:mm", true).diff(moment(evdb + " " + evtb, "YYYY/MM/DD HH:mm", true));
      });
    }

    //服务器要求上下文内放置日程查询结果
    this.output(content, contextRetMap, 'agendas', WsDataConfig.SCD, scd);

    //服务器要求上下文内放置日程查询结果
    this.output(content, contextRetMap, 'memos', WsDataConfig.MOD, memos);

    //服务器要求上下文内放置日程查询结果
    this.output(content, contextRetMap, 'planitems', WsDataConfig.PID, planitems);

    //服务器要求上下文内放置日程的创建人员信息或查询条件用的人员信息
    this.output(content, contextRetMap, 'contacts', WsDataConfig.FS, fs);

    return contextRetMap;
  }

}
