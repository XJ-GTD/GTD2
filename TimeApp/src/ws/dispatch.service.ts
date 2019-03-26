import {Injectable} from "@angular/core";
import {WsModel} from "./model/ws.model";
import {WsContent} from "./model/content.model";
import {ProcessFactory} from "./process.factory";
import {ProcesRs} from "./model/proces.rs";
import {EmitService} from "../service/util-service/emit.service";

/**
 * 消息处理分发
 *
 * create by wzy on 2018/11/30.
 */
@Injectable()
export class DispatchService {
  constructor(private factory:ProcessFactory,  private emitService: EmitService,){}
  async dispatch(message: string) {
    setTimeout(()=>{
      this.emitService.emitScd(null);
      setTimeout(()=>{
        this.emitService.emitScdLs(null);

      },3000);
      setTimeout(()=>{
        this.emitService.emitSpeech(null);

      },5000);

    },1000);
    // //消息格式化
    // let model: WsModel = JSON.parse(message);
    // //循环处理消息
    // let process:ProcesRs = new ProcesRs();
    // for (let opt of model.header.describe) {
    //   let wsContent: WsContent = model.content.get(opt);
    //   process = await this.factory.findProcess(opt).go(wsContent,process);
    // }
    return;
  }
}
