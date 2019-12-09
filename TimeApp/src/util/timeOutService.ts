import {EmitService} from "../service/util-service/emit.service";
import {NotificationsService} from "../service/cordova/notifications.service";
import {UtilService} from "../service/util-service/util.service";
import {Injectable} from "@angular/core";

@Injectable()
export class TimeOutService {
  constructor(private emitService: EmitService,
              private notificationsService: NotificationsService, private util: UtilService,) {

  }

  works:Map<string,Worker> = new Map<string, Worker>();
  notifworks:Map<string,number> = new Map<string, number>();

  timeout(mi: number, fn: Function, emitKey: string) {
    // if (this.util.isAppBack() && this.util.isMobile() && !this.util.isIOS()) {
    //   this.emitService.register(emitKey, () => {
    //     fn();
    //     this.emitService.destroy(emitKey);
    //   });
    //   //提醒间隔最小单位是秒，所以/1000
    //   this.notificationsService.sysTimeout(emitKey, mi  < 1000 ? 1 : mi / 1000);
    // }
    if (this.util.isAppBack() && this.util.isMobile()) {
      //直接返回，不要要timeout设置
        fn();
      //提醒间隔最小单位是秒，所以/1000
      // this.notificationsService.sysTimeout(emitKey, mi  < 1000 ? 1 : mi / 1000);
    }
    else {
      let timeoutWork = new Worker("./workerTimeout.js");
      timeoutWork.onmessage = (message) => {
        fn();
        timeoutWork.terminate();
      }
      timeoutWork.postMessage(mi);
    }
  }

  timeOutOnlyOne(mi: number, fn: Function, emitKey: string){

    if (this.util.isAppBack() && this.util.isMobile() && !this.util.isIOS()) {
      this.emitService.register(emitKey, () => {
         fn();
        this.emitService.destroy(emitKey);
      });
      //提醒间隔最小单位是秒，所以/1000
      let id = this.notifworks.get(emitKey);
      if (id) this.notificationsService.cancel(id)
      id = this.notificationsService.sysTimeout(emitKey, mi  < 1000 ? 1 : mi / 1000);
      this.notifworks.set(emitKey,id);
    } else {
      let timeoutWork = this.works.get(emitKey);
      if (!timeoutWork){
        timeoutWork  = new Worker("./workerTimeout.js");
        this.works.set(emitKey,timeoutWork);
        timeoutWork.onmessage = (message) => {
          fn();
          timeoutWork.terminate();
          this.works.delete(emitKey);
        }
      }
      timeoutWork.postMessage(mi);
    }
  }
}
