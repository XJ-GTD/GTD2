import {MQProcess, OptProcess} from "../interface.process";
import {WsContent} from "../model/content.model";
import {Injectable} from "@angular/core";
import {CudscdPara} from "../model/cudscd.para";
import {ProcesRs} from "../model/proces.rs";
import {PI, O, SS} from "../model/ws.enum";
import {FsData, RcInParam, ScdData} from "../../data.mapping";
import {CalendarService,PlanItemData} from "../../service/business/calendar.service";
import {Member} from "../../service/business/event.service";
import {WsDataConfig} from "../wsdata.config";
import {BaseProcess} from "./base.process";
import { UtilService } from "../../service/util-service/util.service";
import * as moment from "moment";
import {Friend} from "../../service/business/grouper.service";

/**
 * 备忘处理
 *
 * create by leonxi on 2019/12/16.
 */
@Injectable()
export class PlanItemsProcess extends BaseProcess implements MQProcess,OptProcess{
  constructor(private calendarService: CalendarService, private util: UtilService) {
    super();
  }

  async do(content: WsContent, contextRetMap: Map<string,any>) {
    //处理区分
    let opt = content.option;

    let prvOpt:string =  "";
    //获取上下文前动作信息
    prvOpt = this.input(content, contextRetMap, "prvoption", WsDataConfig.PRVOPTION, prvOpt);

    //上下文内获取日程查询结果
    let scd:Array<ScdData> = new Array<ScdData>();
    scd = this.input(content, contextRetMap, "planitems", WsDataConfig.PID, scd) || scd;

    //上下文内获取日程人员信息
    let fs :Array<Friend> = new Array<Friend>();
    fs = this.input(content,contextRetMap,"contacts",WsDataConfig.FS,fs) || fs;

    //process处理符合条件则执行
    console.log("******************planitems do when")
    if (content.when && content.when !=""){
      console.log("******************planitems do when in " + content.when)
      let rf :boolean = false;
      try {
        let fun = eval("("+content.when+")");
        rf = fun(content,scd,fs);
      }catch (e){
        rf = false;
      }
      if (!rf){
        return contextRetMap;
      }
    }

    //确认操作
    for (let c of scd){
	    let rcIn: PlanItemData = {} as PlanItemData;

      rcIn.jtn = c.sn;
      rcIn.sd = c.sd || moment().format("YYYY/MM/DD");
      rcIn.st = c.st;

      if (c.si && c.si != null && c.si != '') {
        rcIn.jti = c.si;
      }

      for (let f of  fs) {
        let member: Member = {} as Member;
        Object.assign(member, f);

        rcIn.members = rcIn.members || new Array<Member>();

        rcIn.members.push(member);
      }

      if (prvOpt == PI.C) {
        let saved: Array<PlanItemData> = await this.calendarService.savePlanItem(rcIn);

        if (saved && saved.length > 0) {
          c.si = saved[0].jti;
          c.sd = saved[0].sd;
          c.st = saved[0].st;
          c.sn = saved[0].jtn;
        }
      } else if (prvOpt == PI.U) {
        let origin: PlanItemData = await this.calendarService.getPlanItem(rcIn.jti);
        let updated: PlanItemData = {} as PlanItemData;
        this.util.cloneObj(updated, origin);

        if (rcIn.members && rcIn.members.length > 0) {
          updated.members = updated.members || new Array<Member>();

          for (let member of rcIn.members){
            let existindex: number = updated.members.findIndex((ele) => {
              return ele.rc == member.rc;
            });

            if (existindex < 0) {
              updated.members.push(member);
            }
          }

          updated.pn = updated.members.length;
        }

        await this.calendarService.savePlanItem(updated, origin);
      } else {
      	let originPlanItem: PlanItemData = {} as PlanItemData;
      	originPlanItem = await this.calendarService.getPlanItem(rcIn.jti);

        await this.calendarService.removePlanItem(originPlanItem);
      }
    }

    console.log("******************planitems do end");

    return contextRetMap;
  }

  async gowhen(content: WsContent, contextRetMap: Map<string,any>) {

    //记录当前option，为其后动作使用
    contextRetMap.set(WsDataConfig.OPTION4SPEECH, content.option);

    //记录当前processor，为其后动作使用
    contextRetMap.set(WsDataConfig.PROCESSOR4SPEECH, content.processor);

    //处理所需要参数
    let cudPara:CudscdPara = content.parameters;

    //上下文内获取暂停缓存
    let paused: Array<any> = new Array<any>();
    paused = this.input(content, contextRetMap, "paused", WsDataConfig.PAUSED, paused) || paused;

    //上下文内获取日程查询结果
    let scd:Array<ScdData> = new Array<ScdData>();
    scd = this.input(content, contextRetMap, "planitems", WsDataConfig.PID, scd) || scd;

    //上下文内获取日程人员信息
    let fs :Array<Friend> = new Array<Friend>();
    fs = this.input(content, contextRetMap, "contacts", WsDataConfig.FS, fs) || fs;

    //process处理符合条件则暂停
    if (content.pause && content.pause != "") {
      let pause: boolean = false;

      try {
        let isPause = eval("("+content.pause+")");
        pause = isPause(content, scd, fs);
      } catch (e) {
        pause = false;
      }

      if (pause) {
        let pausedContent: any = {};
        Object.assign(pausedContent, content);
        delete pausedContent.thisContext;

        paused.push(pausedContent);

        //设置上下文暂停处理缓存
        this.output(content, contextRetMap, 'paused', WsDataConfig.PAUSED, paused);

        return contextRetMap;
      }
    }

    //process处理符合条件则执行
    if (content.when && content.when !=""){

      let rf :boolean = false;
      try {
        let fun = eval("("+content.when+")");
        rf = fun(content,scd,fs);
      }catch (e){
        rf = false;
      }
      if (!rf){
        return contextRetMap;
      }
    }

    //处理区分
    // 创建日历项
    if (content.option == PI.C) {
      // F处理返回的结果
      if (scd.length > 0){
        // 上下文有日历项
      } else {
        // 查询没有日历项
        let c:ScdData = new ScdData();
        let scdlist : Array<ScdData> = new Array<ScdData>();
        scdlist.push(c);

        for (let c of scdlist){
          c.sd = cudPara.d == null?c.sd:cudPara.d;
          c.sn = cudPara.ti == null?c.sn:cudPara.ti;
          c.st = cudPara.t == null?c.st:cudPara.t;
        }

        scd = scdlist;
      }

    }

    // 更新日历项
    if (content.option == PI.U) {
      // 设置修改后内容
      for (let c of scd){
        c.sn = (cudPara.ti == null || cudPara.ti == '')?c.sn:cudPara.ti;
        c.sd = (cudPara.d == null || cudPara.d == '')? c.sd:cudPara.d;
        c.st = (cudPara.t == null || cudPara.t == '')?c.st:cudPara.t;

        //显示本次添加的人
        c.fss = fs;
      }
    }

    // 删除日历项
    if (content.option == PI.D) {
    }

    //上下文内放置创建的或修改的日历项更新内容
    this.output(content, contextRetMap, 'planitems', WsDataConfig.PID, scd);

    //上下文内放置创建的或修改的日历项联系人
    this.output(content, contextRetMap, 'contacts', WsDataConfig.FS, fs);

    return contextRetMap;
  }

}