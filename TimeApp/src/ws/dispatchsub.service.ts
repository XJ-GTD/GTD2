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
export class DispatchSubService {
  constructor(private factory: ProcessFactory) {
  }

  async subprocess(processes: Array<any> = new Array<any>(), contextRetMap: Map<string, any> = new Map<string, any>(), model: WsModel): Promise<Map<string, any>> {

    //循环处理子处理
    for (let process of processes) {
      let opt = process['processor'];
      let wsContent: WsContent = new WsContent();
      Object.assign(wsContent, process);

      //保存上下文
      wsContent.thisContext = model;
      // 当处理异常时，跳出循环
      try {
        contextRetMap = await this.factory.getProcess(opt).gowhen(wsContent, contextRetMap);
      } catch (e) {
        break;
      } finally {
      }
    }

    return contextRetMap;
  }
}
