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
  constructor(private factory: ProcessFactory, private util: UtilService,private sqlite:SqliteExec,private emitService:EmitService) {
  }

  async dispatch(message: string) {
    //消息格式化
    console.log("******************dispatch  message:"+message);
    let log:LogTbl = new LogTbl();
    log.id = this.util.getUuid();
    log.su = message
    log.ss = new Date().valueOf();
    log.t = 2;

    let model: WsModel = JSON.parse(message);

    // console.log(moment().unix() - model.context.client.time);
    // 增加判断服务端响应效率和客户端处理效率分析
    let currenttime = moment().valueOf();
    if (model && model.context && model.context.client && model.context.client.time) {
      let serverratio = currenttime - model.context.client.time;

      model.context.client['serverratio'] = serverratio;
      model.context.client.time = currenttime;
    }

    if (model.context && model.context.server)
      DataConfig.wsServerContext = model.context.server;

    //版本升级

    //循环处理消息
    //保存上下文操作的各种结果
    let contextRetMap: Map<string,any> = new Map<string, any>();
    let starttime = currenttime;

    //按序获取describe对应的操作
    for (let i = 0, len = model.header.describe.length; i < len; i++) {
      let opt = model.header.describe[i];
      let wsContent: WsContent = model.content[i];
      //保存上下文
      wsContent.thisContext = model;
      console.log("******************dispatch  process: "+opt);
      // 当处理异常时，跳出循环
      try {
        //TODO
        this.emitService.emit("on.websocket.workqueue.init",opt);
        contextRetMap = await this.factory.getProcess(opt).gowhen(wsContent, contextRetMap);
        this.emitService.emit("on.websocket.workqueue.init",opt + "处理结束");
      } catch (e) {
        console.log('\r\n', e, '\r\n', e.stack);
        break;
      } finally {
        //存在客户端上下文的情况下
        if (model && model.context && model.context.client && model.context.client.ratios) {
          let steptime = moment().valueOf();
          model.context.client.ratios.push({operation: opt, ratio: (steptime - starttime)});
          starttime = steptime;
        }
      }
    }

    log.ss = new Date().valueOf() - log.ss;
    log.st = true;
    this.sqlite.noteLog(log);
    return;
  }
}
