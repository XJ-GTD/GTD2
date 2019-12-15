import {Injectable} from "@angular/core";
import {MQProcess, OptProcess} from "./interface.process";
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

/**
 * webSocket公用处理方法
 *
 * create by wzy on 2018/11/30.
 */
@Injectable()
export class OptProcessFactory {
  private factoryOpt: Map<string, OptProcess> = new Map<string, OptProcess>();

  constructor(private defaultProcess: DefaultProcess,
              private agendasProcess:AgendasProcess
  ) {
    this.factoryOpt.set("AG", this.agendasProcess);
  }

  getOptProcess(processKey: string): OptProcess {
    let process: OptProcess = this.factoryOpt.get(processKey);
    if (process == null) return this.defaultProcess;
    return process;
  }
}
