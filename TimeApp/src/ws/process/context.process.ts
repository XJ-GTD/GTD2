import {MQProcess} from "../interface.process";
import {WsContent} from "../model/content.model";
import {ProcessFactory} from "../process.factory";
import {EmitService} from "../../service/util-service/emit.service";
import {Injectable} from "@angular/core";
import {CudscdPara} from "../model/cudscd.para";
import {ProcesRs} from "../model/proces.rs";

/**
 * 日程修改（获取上下文中） SC
 *
 * create by wzy on 2018/11/30.
 */
@Injectable()
export class ContextProcess implements MQProcess{
  constructor() {
  }

  async gowhen(content: WsContent, contextRetMap: Map<string,any>) {


    let prv:ProcesRs = content.thisContext.context.client.cxt;
    if (!prv) prv = new ProcesRs();

    //process处理符合条件则执行
    if (content.when && content.when !=""){
      let fun = eval("("+content.when+")");
      if (!fun(content,prv.scd,prv.fs)){
        return contextRetMap;
      }
    }

    //服务器要求上下文内放置语音上下文前动作标志
    let prvOpt = content.thisContext.context.client.option;
    if (content.output && (content.output.prvoption ||content.output.prvoption =="")){
      if (content.output.prvoption != "") contextRetMap.set(content.output.prvoption,prvOpt );
    } else {
      contextRetMap.set("prvoption",prvOpt );
    }

    //服务器要求上下文内放置语音上下文前process标志
    let prvprocessor = content.thisContext.context.client.processor;
    if (content.output && (content.output.prvprocessor ||content.output.prvprocessor =="")){
      if (content.output.prvprocessor != "") contextRetMap.set(content.output.prvprocessor,prvprocessor );
    } else {
      contextRetMap.set("prvprocessor",prvprocessor );
    }

    //服务器要求上下文内放置语音上下文日程
    if (content.output && (content.output.agendas ||content.output.agendas =="")){
      if (content.output.agendas != "") contextRetMap.set(content.output.agendas, prv.scd);
    } else {
      contextRetMap.set("scd", prv.scd);
    }

    //服务器要求上下文内放置日程人员信息
    if (content.output && (content.output.contacts || content.output.contacts =="")){
      // 名称设置为空字符串表示不需要往处理上下文中输出
      if (content.output.contacts != "") contextRetMap.set(content.output.contacts, prv.fs);
    } else {
      // 输出未设置表示向处理上下文使用默认名称输出
      contextRetMap.set("fs", prv.fs);
    }

    return contextRetMap
  }

  async go(content: WsContent,processRs:ProcesRs){
      processRs.scd = content.thisContext.context.client.cxt.scd;
      processRs.fs = content.thisContext.context.client.cxt.fs;
      processRs.sucess = true;
      return processRs;
  }
}
