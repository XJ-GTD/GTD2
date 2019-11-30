import {EmitService} from "../service/util-service/emit.service";
import {NotificationsService} from "../service/cordova/notifications.service";
import {UtilService} from "../service/util-service/util.service";
import {Injectable} from "@angular/core";

@Injectable()
export class TimeOutService {
  constructor(private emitService: EmitService,
              private notificationsService: NotificationsService, private util: UtilService,) {

  }

  timeout(mi: number, fn: Function, emitKey: string) {
    if (this.util.isAppBack() && this.util.isMobile() && !this.util.isIOS()) {
      this.emitService.register(emitKey, () => {
        fn();
        this.emitService.destroy(emitKey);
      })
      this.notificationsService.systimeout(emitKey, mi  < 1000 ? 1 : mi / 1000);
    } else {
      let timeoutWork = new Worker("./workerTimeout.js");
      timeoutWork.onmessage = (message) => {
        fn();
        timeoutWork.terminate();
      }
      timeoutWork.postMessage(mi);
    }
  }
}
