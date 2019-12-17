import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from "@angular/core";
import {IonicModule} from "ionic-angular";
import {WebsocketService} from "./websocket.service";
import {ProcessFactory} from "./process.factory";
import {DispatchService} from "./dispatch.service";
import {CudscdProcess} from "./process/cudscd.process";
import {RemindProcess} from "./process/remind.process";
import {SpeechProcess} from "./process/speech.process";
import {ThirdProcess} from "./process/third.process";
import {DefaultProcess} from "./process/default.process";
import {FindProcess} from "./process/find.process";
import {OptionProcess} from "./process/option.process";
import {ContextProcess} from "./process/context.process";
import {ReceiveProcess} from "./process/receive.process";
import {SettingProcess} from "./process/setting.process";
import {SsService} from "../pages/ss/ss.service";
import {FdService} from "../pages/fd/fd.service";
import {FsService} from "../pages/fs/fs.service";
import {OptProcessFactory} from "./optprocess.factory";
import {AgendasProcess} from "./process/agendas.process";
import {BaseProcess} from "./process/base.process";
import {MarkupProcess} from "./process/markup.process";
import {NotificationProcess} from "./process/notification.process";
import {SpecialDataProcess} from "./process/specialdata.process";
import {DataSyncProcess} from "./process/datasync.process";
import {CacheProcess} from "./process/cache.process";
import {MemosProcess} from "./process/memos.process";
import {PlanItemsProcess} from "./process/planitems.process";

/**
 * WebSocket组件
 *
 * create by zhangjy on 2018/07/22.
 */
@NgModule({
  imports: [IonicModule],
  providers: [WebsocketService,
    OptProcessFactory,
    ProcessFactory, DispatchService,
    BaseProcess, DataSyncProcess,
    CudscdProcess, RemindProcess,
    SpeechProcess, ThirdProcess,
    DefaultProcess, FindProcess,
    OptionProcess, ContextProcess,
    ReceiveProcess, SettingProcess,
    AgendasProcess, MarkupProcess,
    MemosProcess, PlanItemsProcess,
    NotificationProcess, SpecialDataProcess,
    CacheProcess, SsService,
    FdService, FsService
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class WebsocketModule {

}
