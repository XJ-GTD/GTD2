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


/**
 * WebSocket组件
 *
 * create by zhangjy on 2018/07/22.
 */
@NgModule({
  imports: [IonicModule],
  providers: [WebsocketService,
    ProcessFactory, DispatchService,
    CudscdProcess, RemindProcess,
    SpeechProcess, ThirdProcess,
    DefaultProcess, FindProcess,
    OptionProcess, ContextProcess,
    ReceiveProcess,SettingProcess,
    SsService,FdService
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class WebsocketModule {

}
