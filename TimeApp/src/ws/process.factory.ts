import {Injectable} from "@angular/core";
import {WsModel} from "./model/ws.model";
import {MQProcess} from "./process/interface.process";
import {CudscdProcess} from "./process/cudscd.process";
import {FindFriendProcess} from "./process/findfriend.process";
import {FindScdProcess} from "./process/findscd.process";
import {RemindProcess} from "./process/remind.process";
import {SendProcess} from "./process/send.process";
import {ThirdProcess} from "./process/third.process";
import {SpeechProcess} from "./process/speech.process";
import {DefaultProcess} from "./process/default.process";

/**
 * webSocket公用处理方法
 *
 * create by wzy on 2018/11/30.
 */
@Injectable()
export class ProcessFactory {
  private factory: Map<string, MQProcess> = new Map<string, MQProcess>();

  constructor(private cudscdProcess: CudscdProcess,
              private findFriendProcess: FindFriendProcess,
              private findScdProcess: FindScdProcess,
              private remindProcess: RemindProcess,
              private sendProcess: SendProcess,
              private speechProcess: SpeechProcess,
              private thirdProcess: ThirdProcess,
              private defaultProcess: DefaultProcess,
  ) {
    this.factory.set("CD", this.cudscdProcess);
    this.factory.set("FF", this.findFriendProcess);
    this.factory.set("FD", this.findScdProcess);
    this.factory.set("R", this.remindProcess);
    this.factory.set("S", this.sendProcess);
    this.factory.set("SP", this.speechProcess);
    this.factory.set("TH", this.thirdProcess);
  }

  findProcess(processKey: string): MQProcess {
    let process: MQProcess = this.factory.get(processKey);
    if (process == null) return this.defaultProcess;
    return process;
  }
}
