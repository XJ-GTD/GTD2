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
import {AgendaData, EventService, Member} from "../../service/business/event.service";
import {ObjectType} from "../../data.enum";
import {
  CalendarService,
  FindActivityCondition,
  ActivityData,
  PlanItemData
} from "../../service/business/calendar.service";
import {Friend, GrouperService} from "../../service/business/grouper.service";
import {DataConfig} from "../../service/config/data.config";

/**
 * 查询联系人和日历
 *
 * create by wzy on 2018/11/30.
 */
@Injectable()
export class FindProcess extends BaseProcess implements MQProcess {
  constructor(private sqliteExec: SqliteExec, private fsService: FsService,private calendarService:CalendarService,
               private util:UtilService,private eventService:EventService,private grouperService:GrouperService) {
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
    let fs :Array<Friend> = new Array<Friend>();

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
      if (finds.targets && finds.targets.length > 0)  condition.target = finds.targets.reduce((target, ele) => {
        if (ele == ObjectType.Event) target.push(ObjectType.Event);
        if (ele == ObjectType.Memo) target.push(ObjectType.Memo);
        if (ele == ObjectType.Calendar) target.push(ObjectType.Calendar);
        return target;
      }, new Array<ObjectType>());

      let activities: ActivityData = await this.calendarService.findActivities(condition);
      let index = 0;

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
          escd.adr = event.adr;

          if (index == activities.events.length - 1){
            let agendaData:AgendaData = await this.eventService.getAgenda(escd.si,true);
            let creator:Friend = {} as Friend;
            // creator.ran = agendaData.creator.ran;
            escd.fs = creator;
            let showFss:Array<Friend> = new Array<Friend>();
            agendaData.members.forEach((member)=>{
              let friend:Friend = {} as Friend;
              friend.ran = member.ran;
              showFss.push(friend);
            })
            escd.showfss = showFss;
          }
          scd.push(escd);
          index ++ ;

          if (scd.length >= 50) {
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

          if (memos.length >= 50) {
            break;
          }
        }
      }

      if (activities.calendaritems && activities.calendaritems.length > 0) {
        index = 0;
        for (let calendaritem of activities.calendaritems) {
          let escd: ScdData = new ScdData();

          escd.si = calendaritem.jti;
          escd.sn = calendaritem.jtn;
          escd.ui = calendaritem.ui;
          escd.sd = calendaritem.sd;
          escd.st = calendaritem.st;

          if (index == activities.calendaritems.length - 1){
            let planItemData:PlanItemData = await this.calendarService.getPlanItem(escd.si,true);
            let creator:Friend = {} as Friend;
            // creator.ran =  this.grouperService.getMemberFromCache(planItemData.ui,UserConfig.friends).ran;
            escd.fs = creator;
            let showFss:Array<Friend> = new Array<Friend>();
            planItemData.members.forEach((member)=>{
              let friend:Friend = {} as Friend;
              friend.ran = member.ran;
              showFss.push(friend);
            })
            escd.showfss = showFss;
          }

          planitems.push(escd);
          index ++ ;

          if (planitems.length >= 50) {
            break;
          }
        }
      }
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
