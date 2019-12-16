import {Injectable} from "@angular/core";
import {MQProcess} from "./interface.process";
import {CudscdProcess} from "./process/cudscd.process";
import {RemindProcess} from "./process/remind.process";
import {ThirdProcess} from "./process/third.process";
import {SpeechProcess} from "./process/speech.process";
import {DefaultProcess} from "./process/default.process";
import {FindProcess} from "./process/find.process";
import {OptionProcess} from "./process/option.process";
import {ContextProcess} from "./process/context.process";
import {ReceiveProcess} from "./process/receive.process";
import {SettingProcess} from "./process/setting.process";
import {AgendasProcess} from "./process/agendas.process";
import {MarkupProcess} from "./process/markup.process";
import {NotificationProcess} from "./process/notification.process";
import {SpecialDataProcess} from "./process/specialdata.process";
import {DataSyncProcess} from "./process/datasync.process";
import {CacheProcess} from "./process/cache.process";
import {MemosProcess} from "./process/memos.process";

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
              private findProcess:FindProcess,
              private optionProcess:OptionProcess,
              private contextProcess:ContextProcess,
              private receiveProcess:ReceiveProcess,
              private settingProcess:SettingProcess,
              private agendasProcess:AgendasProcess,
              private memosProcess:MemosProcess,
              private markupProcess:MarkupProcess,
              private datasyncProcess:DataSyncProcess,
              private specialDataProcess:SpecialDataProcess,
              private notificationProcess:NotificationProcess,
              private cacheProcess:CacheProcess
  ) {

    this.factory.set("S", this.speechProcess);
    this.factory.set("F", this.findProcess);
    this.factory.set("SS", this.cudscdProcess);
    this.factory.set("R", this.remindProcess);
    this.factory.set("T", this.thirdProcess);
    this.factory.set("O", this.optionProcess);
    this.factory.set("SC", this.contextProcess);
    this.factory.set("SH", this.receiveProcess);
    this.factory.set("SY", this.settingProcess);
    this.factory.set("AG", this.agendasProcess);
    this.factory.set("MO", this.memosProcess);
    this.factory.set("MK", this.markupProcess);
    this.factory.set("SD", this.specialDataProcess);
    this.factory.set("PN", this.notificationProcess);
    this.factory.set("DS", this.datasyncProcess);
    this.factory.set("CA", this.cacheProcess);
  }

  getProcess(processKey: string): MQProcess {
    let process: MQProcess = this.factory.get(processKey);
    if (process == null) return this.defaultProcess;
    return process;
  }
}
