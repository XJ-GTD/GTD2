import {Injectable} from "@angular/core";
import { JPush, AliasOptions, TagOptions } from '@jiguang-ionic/jpush';

/**
 * JPush 极光推送服务
 *
 * create by xilj on 2019/06/19.
 */
@Injectable()
export class JPushService {
  sequence: number = 0;

  constructor(private jpush: JPush) {
  }

  init() {
    this.jpush.init();
    this.jpush.setDebugMode(true);

    this.jpush.isPushStopped().then((isPushStopped) => {
      if (isPushStopped == 0) {
        console.log("JPush service stopped.");

        this.jpush.resumePush();
        console.log("JPush service starting resume.");
      } else {
        console.log("JPush service is running.");
      }
    });
  }

  getRegistrationID(): Promise<any> {
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
