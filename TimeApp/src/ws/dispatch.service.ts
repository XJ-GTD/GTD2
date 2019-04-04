import {Injectable} from "@angular/core";
import {WsModel} from "./model/ws.model";
import {WsContent} from "./model/content.model";
import {ProcessFactory} from "./process.factory";
import {ProcesRs} from "./model/proces.rs";
import {EmitService} from "../service/util-service/emit.service";
import * as moment from 'moment';
import {DataConfig} from "../service/config/data.config";

/**
 * 消息处理分发
 *
 * create by wzy on 2018/11/30.
 */
@Injectable()
export class DispatchService {
  constructor(private factory:ProcessFactory,  private emitService: EmitService,){}
  async dispatch(message: string) {
    //消息格式化
    let model: WsModel = JSON.parse(message);
    // console.log(moment().unix() - model.context.client.time);
    DataConfig.wsServerContext = model.context.server;
    //循环处理消息
    let process:ProcesRs = new ProcesRs();
    for (let opt of model.header.describe) {
      let wsContent: WsContent = model.content[opt];
      //保存上下文
      wsContent.thisContext = model;
      process = await this.factory.getProcess(opt).go(wsContent,process);
    }
    return;
  }
}
