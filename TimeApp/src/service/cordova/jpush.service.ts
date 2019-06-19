import {Injectable} from "@angular/core";
import { JPush, AliasOptions, TagOptions } from '@jiguang-ionic/jpush';
import {EmitService} from "../util-service/emit.service";

/**
 * JPush 极光推送服务
 *
 * create by xilj on 2019/06/19.
 */
@Injectable()
export class JPushService {
  sequence: number = 0;
  alias: string = "";
  registerid: string = "";
  tags: Array<string> = new Array<string>();

  constructor(private jpush: JPush,
              private emitService: EmitService) {
  }

  init() {
    this.jpush.init();
    this.jpush.setDebugMode(true);

    this.checkStatus();
  }

  checkStatus() {
    this.jpush.isPushStopped().then((isPushStopped) => {
      if (isPushStopped == 0) {
        console.log("JPush service stopped.");

        this.jpush.resumePush();
        console.log("JPush service starting resume.");

        //5秒后重新确认状态
        setTimeout(() => {
          this.checkStatus();
        }, 5000);
      } else {
        console.log("JPush service is running.");

        this.jpush.getAlias({sequence: this.sequence++})
        .then((result) => {
          this.alias = result;
        });

        this.jpush.getAllTags({sequence: this.sequence++})
        .then((result) => {
          this.tags = result;
        });

        this.jpush.getRegistrationID()
        .then((result) => {
          this.registerid = result;

          this.emitService.emit("on.jpush.registerid.loaded");
        });
      }
    });
  }

  getRegistrationID() {
    return this.jpush.getRegistrationID();
  }

  setAlias(alias: string) {
    this.jpush.getAlias({sequence: this.sequence++}).then((result) => {
      var sequence: number = result.sequence;
    });
  }

  addTags(regId: string, tags: Array<string>) {

  }
}
