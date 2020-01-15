import {MQProcess} from "../interface.process";
import {WsContent} from "../model/content.model";
import {Injectable} from "@angular/core";
import {SE} from "../model/ws.enum";
import {FsData, RcInParam, ScdData} from "../../data.mapping";
import {DispatchSubService} from "../dispatchsub.service";
import {WsDataConfig} from "../wsdata.config";
import {BaseProcess} from "./base.process";
import {Friend} from "../../service/business/grouper.service";

/**
 * 选择操作 SE
 *
 * create by xilj on 2019/12/18.
 */
@Injectable()
export class ChooseProcess extends BaseProcess implements MQProcess {
  constructor(private dispatchsub: DispatchSubService) {
    super();
  }

  async gowhen(content: WsContent, contextRetMap: Map<string,any>) {

    //处理区分
    let opt = content.option;

    //上下文内获取日程查询结果
    let paused: Array<any> = new Array<any>();
    paused = this.input(content, contextRetMap, "paused", WsDataConfig.PAUSED, paused) || paused;

    //上下文内获取日程查询结果
    let scd:Array<ScdData> = new Array<ScdData>();
    scd = this.input(content,contextRetMap,"agendas",WsDataConfig.SCD,scd);

    //上下文内获取日程查询结果
    let memos:Array<ScdData> = new Array<ScdData>();
    memos = this.input(content,contextRetMap,"memos",WsDataConfig.MOD,memos);

    //上下文内获取日程查询结果
    let planitems:Array<ScdData> = new Array<ScdData>();
    planitems = this.input(content,contextRetMap,"planitems",WsDataConfig.PID,planitems);

    //上下文内获取查询条件用日程人员或创建的日程人员
    let fs :Array<Friend> = new Array<Friend>();
    fs = this.input(content,contextRetMap,"contacts",WsDataConfig.FS,fs);

    //process处理符合条件则执行
    if (content.when && content.when !=""){
      let rf :boolean = false;

      try {
        let fun = eval("("+content.when+")");
        rf = fun(content,scd,fs,memos,planitems);
      }catch (e){
        rf = false;
      };

      if (!rf){
        return contextRetMap;
      }
    }

    //清空上下文暂停处理缓存
    this.output(content, contextRetMap, 'paused', WsDataConfig.PAUSED, new Array<any>());

    if (opt == SE.DO) {
      contextRetMap = await this.dispatchsub.subprocess(paused, contextRetMap, content.thisContext);
    } else {

    }


    return contextRetMap;
  }

}
