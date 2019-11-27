import {EmitService} from "../service/util-service/emit.service";
import {NotificationsService} from "../service/cordova/notifications.service";
import {UtilService} from "../service/util-service/util.service";
import {Injectable} from "@angular/core";

@Injectable()
export class TimeOutService {

  isAppback: boolean = false;

  constructor(private emitService: EmitService,
              private notificationsService: NotificationsService, private util: UtilService,) {

    document.addEventListener("resume", () => {

      console.log("当前任务=====resume"); //进入，前台展示
      this.isAppback = false;

    }, false);

    document.addEventListener("pause", () => {

      console.log("当前任务=====pause"); //进入，前台展示
      this.isAppback = true;

    }, false);

  }

  timeout(mi: number, fn: Function, emitKey: string) {
    this.util.isIOS()
    if (this.isAppback && this.util.isMobile() && !this.util.isIOS()) {
      this.emitService.register(emitKey, () => {
        fn();
        this.emitService.destroy(emitKey);
      })
      this.notificationsService.systimeout(emitKey, mi / 1000 < 1 ? 1 : mi / 1000);
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
