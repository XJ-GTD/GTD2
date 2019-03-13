import {Injectable} from "@angular/core";
import {MQProcess} from "./interface.process";
import {CudscdProcess} from "./process/cudscd.process";
import {RemindProcess} from "./process/remind.process";
import {ThirdProcess} from "./process/third.process";
import {SpeechProcess} from "./process/speech.process";
import {DefaultProcess} from "./process/default.process";
import {FindProcess} from "./process/find.process";

/**
 * webSocket公用处理方法
 *
 * create by wzy on 2018/11/30.
 */
@Injectable()
export class ProcessFactory {
  private factory: Map<string, MQProcess> = new Map<string, MQProcess>();

  constructor(private cudscdProcess: CudscdProcess,
              private remindProcess: RemindProcess,
              private speechProcess: SpeechProcess,
              private thirdProcess: ThirdProcess,
              private defaultProcess: DefaultProcess,
              private find:FindProcess,
  ) {
    this.factory.set("S", this.speechProcess);
    this.factory.set("F", this.find);
    this.factory.set("SS", this.cudscdProcess);
    this.factory.set("R", this.remindProcess);
    this.factory.set("TH", this.thirdProcess);
  }

  findProcess(processKey: string): MQProcess {
    let process: MQProcess = this.factory.get(processKey);
    if (process == null) return this.defaultProcess;
    return process;
  }
}
