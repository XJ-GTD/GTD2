import {Injectable} from "@angular/core";
import {WsModel} from "./model/ws.model";
import {WsContent} from "./model/content.model";
import {ProcessFactory} from "./process.factory";
import {ProcesRs} from "./model/proces.rs";
import {EmitService} from "../service/util-service/emit.service";
import * as moment from 'moment';
import {DataConfig} from "../service/config/data.config";
import {LogTbl} from "../service/sqlite/tbl/log.tbl";
import {UtilService} from "../service/util-service/util.service";
import {SqliteExec} from "../service/util-service/sqlite.exec";

/**
 * 消息处理分发
 *
 * create by wzy on 2018/11/30.
 */
@Injectable()
export class DispatchService {
  constructor(private factory: ProcessFactory, private util: UtilService,private sqlite:SqliteExec) {
  }

  async dispatch(message: string) {
    //消息格式化

    let log:LogTbl = new LogTbl();
    log.id = this.util.getUuid();
    log.su = message
    log.ss = new Date().valueOf();
    log.t = 2;

    let model: WsModel = JSON.parse(message);
    // console.log(moment().unix() - model.context.client.time);
    if (model.context && model.context.server)
      DataConfig.wsServerContext = model.context.server;
    //循环处理消息
    let process: ProcesRs = new ProcesRs();
    for (let opt of model.header.describe) {
      let wsContent: WsContent = model.content[opt];
      //保存上下文
      wsContent.thisContext = model;
      process = await this.factory.getProcess(opt).go(wsContent, process);
    }

    log.ss = new Date().valueOf() - log.ss;
    log.st = true;
    this.sqlite.noteLog(log);
    return;
  }
}
