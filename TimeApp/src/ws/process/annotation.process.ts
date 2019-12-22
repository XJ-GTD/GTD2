import {MQProcess, OptProcess} from "../interface.process";
import {WsContent} from "../model/content.model";
import {FriendEmData, ScdEmData} from "../../service/util-service/emit.service";
import {Injectable} from "@angular/core";
import {CudscdPara} from "../model/cudscd.para";
import {ProcesRs} from "../model/proces.rs";
import {DataConfig} from "../../service/config/data.config";
import {UserConfig} from "../../service/config/user.config";
import {CTbl} from "../../service/sqlite/tbl/c.tbl";
import {AT, O, SS} from "../model/ws.enum";
import {FsData, RcInParam, ScdData} from "../../data.mapping";
import {EventService, AgendaData, Member, multipleoffive} from "../../service/business/event.service";
import {AnnotationService, Annotation} from "../../service/business/annotation.service";
import {WsDataConfig} from "../wsdata.config";
import {BaseProcess} from "./base.process";
import {DelType} from "../../data.enum";
import { UtilService } from "../../service/util-service/util.service";

/**
 * 日程At处理
 *
 * create by xilj on 2019/12/22.
 */
@Injectable()
export class AnnotationProcess extends BaseProcess implements MQProcess, OptProcess{
  constructor(private eventService: EventService, private annotationService: AnnotationService, private util: UtilService) {
    super();
  }

  async do(content: WsContent, contextRetMap: Map<string, any>) {
    //处理区分
    let opt = content.option;

    //获取上下文前动作信息
    let prvOpt: string =  "";

    prvOpt = this.input(content, contextRetMap, "prvoption", WsDataConfig.PRVOPTION, prvOpt);

    //上下文内获取暂停缓存
    let paused: Array<any> = new Array<any>();
    paused = this.input(content, contextRetMap, "paused", WsDataConfig.PAUSED, paused) || paused;

    //上下文内获取日程查询结果
    let scd:Array<ScdData> = new Array<ScdData>();
    scd = this.input(content, contextRetMap, "agendas", WsDataConfig.SCD, scd);

    //上下文内获取日程人员信息
    let fs :Array<FsData> = new Array<FsData>();
    fs = this.input(content, contextRetMap, "contacts", WsDataConfig.FS, fs);

    //process处理符合条件则暂停
    console.log("******************annotation do pause");
    if (content.pause && content.pause != "") {
      console.log("******************annotation do pause in " + content.pause);
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
    console.log("******************annotation do when")
    if (content.when && content.when !=""){
      console.log("******************annotation do when in " + content.when)
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
    for (let c of scd) {
      if (!c.si || !fs || fs.length <= 0) continue;    // 如果日程id没有带过来，或者参与人不存在，不处理

      let evi: string = c.si;

      let agenda: AgendaData = await this.eventService.getAgenda(evi, true);

      if (!agenda || agenda.del == DelType.del) continue;  // 日程不存在或者已删除，不处理

      // 判断指定参与人是否属于本日程的参与人
      let members: Array<Member> = agenda.members.find((ele) => {
        return (fs.findIndex((value) => {
          return value.rc == ele.rc;
        }) >= 0);
      }) || new Array<Member>();

      if (members.length <= 0) continue;              // 指定人员不在参与人中，不处理

      let annotation: Annotation = new Annotation();

      annotation.ui = agenda.ui;
      annotation.obi = evi;
      members.each((member) => {
        annotation.rcs.push(member.rc);
      });

      this.annotationService.saveAnnotation(annotation);
    }

    console.log("******************annotation do end")

    //上下文内放置创建的或修改的日程更新内容
    this.output(content, contextRetMap, 'agendas', WsDataConfig.SCD, scd);

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
    scd = this.input(content, contextRetMap, "agendas", WsDataConfig.SCD, scd);

    //上下文内获取查询条件用日程人员或创建的日程人员
    let fs: Array<FsData> = new Array<FsData>();
    fs = this.input(content, contextRetMap, "contacts", WsDataConfig.FS, fs) || new Array<FsData>();

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

    // AT.C
    if (!scd || scd.length <= 0) {
      //出错记录 EAT
      this.output(content, contextRetMap, 'branchcode', WsDataConfig.BRANCHCODE, WsDataConfig.BRANCHCODE_E0002);

      //出错记录
      this.output(content, contextRetMap, 'branchtype', WsDataConfig.BRANCHTYPE, WsDataConfig.BRANCHTYPE_FORBIDDEN);
    } else if (!fs || fs.length <= 0) {
      //出错记录 EAT
      this.output(content, contextRetMap, 'branchcode', WsDataConfig.BRANCHCODE, WsDataConfig.BRANCHCODE_E0003);

      //出错记录
      this.output(content, contextRetMap, 'branchtype', WsDataConfig.BRANCHTYPE, WsDataConfig.BRANCHTYPE_FORBIDDEN);
    }

    //上下文内放置创建的或修改的日程更新内容
    this.output(content, contextRetMap, 'agendas', WsDataConfig.SCD, scd);

    //上下文内放置创建的或修改的日程联系人
    this.output(content, contextRetMap, 'contacts', WsDataConfig.FS, fs);

    return contextRetMap;
  }

}
