import {MQProcess, OptProcess} from "../interface.process";
import {WsContent} from "../model/content.model";
import {Injectable} from "@angular/core";
import {CudscdPara} from "../model/cudscd.para";
import {ProcesRs} from "../model/proces.rs";
import {PI, O, SS} from "../model/ws.enum";
import {FsData, RcInParam, ScdData} from "../../data.mapping";
import {CalendarService,PlanItemData} from "../../service/business/calendar.service";
import {WsDataConfig} from "../wsdata.config";
import {BaseProcess} from "./base.process";
import { UtilService } from "../../service/util-service/util.service";
import * as moment from "moment";

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
    scd = this.input(content, contextRetMap, "planitems", WsDataConfig.PID, scd);

    //上下文内获取日程人员信息
    let fs :Array<FsData> = new Array<FsData>();
    fs = this.input(content,contextRetMap,"contacts",WsDataConfig.FS,fs);

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

      if (c.si && c.si != null && c.si != '') {
        rcIn.jti = c.si;
      }

      if (prvOpt == PI.C) {
        await this.calendarService.savePlanItem(rcIn);
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

    //上下文内获取日程查询结果
    let scd:Array<ScdData> = new Array<ScdData>();
    scd = this.input(content, contextRetMap, "planitems", WsDataConfig.PID, scd);

    //上下文内获取日程人员信息
    let fs :Array<FsData> = new Array<FsData>();
    fs = this.input(content,contextRetMap,"contacts",WsDataConfig.FS,fs);

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
    // 创建日程
    if (content.option == PI.C) {
      // F处理返回的结果
      if (scd.length > 0){
        // 上下文有日程
      } else {
        // 查询没有日程
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

    // 删除日程
    if (content.option == PI.D) {
    }

    //上下文内放置创建的或修改的日程更新内容
    this.output(content, contextRetMap, 'planitems', WsDataConfig.PID, scd);

    //上下文内放置创建的或修改的日程联系人
    this.output(content, contextRetMap, 'contacts', WsDataConfig.FS, fs);

    return contextRetMap;
  }

}
