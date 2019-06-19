import {Injectable} from "@angular/core";
import { JPush, AliasOptions, TagOptions } from '@jiguang-ionic/jpush';
import {EmitService} from "../util-service/emit.service";
import {UtilService} from "../util-service/util.service";

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
              private util: UtilService,
              private emitService: EmitService) {
  }

  init() {
    this.jpush.init();
    this.jpush.setDebugMode(true);

    this.checkStatus();
  }

  checkStatus(userId: string = "", force: boolean = false) {
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

        if (!this.registerid) {
          this.jpush.getRegistrationID()
          .then((result) => {
            if (result) {
              this.registerid = result;
              this.emitService.emit("on.jpush.registerid.loaded");
            }
          });
        } else {
          if (this.registerid) this.emitService.emit("on.jpush.registerid.loaded");
        }

        if (!this.alias || force) {
          this.jpush.getAlias({sequence: this.sequence++})
          .then((result) => {
            if (result) {
              this.alias = result;
            } else if (userId) {
              //初始化别名
              this.setAlias(this.util.getUuid());
            }
          });
        }

        if (!this.tags || this.tags.length < 0 || force) {
          this.jpush.getAllTags({sequence: this.sequence++})
          .then((result) => {
            if (result && result.length > 0) {
              this.tags = result;
            } else if (userId) {
              this.addTags(["mwxing"]);
            }
          });
        }
      }
    });
  }

  setAlias(alias: string) {
    this.jpush.setAlias({sequence: this.sequence++, alias: alias}).then((result) => {
      var sequence: number = result.sequence;
      this.alias = result.alias;
    });
  }

  addTags(tags: Array<string>) {
    this.jpush.addTags({sequence: this.sequence++, tags: tags}).then((result) => {
      var sequence: number = result.sequence;
      if (result.tags && result.tags.length > 0) {
        this.tags = tags;
      }
    });
  }
}
