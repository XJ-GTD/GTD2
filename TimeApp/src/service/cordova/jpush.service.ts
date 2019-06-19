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
    this.jpush.isPushStopped().then(async (isPushStopped) => {
      if (isPushStopped != 0) {
        console.log("JPush service stopped.");

        this.jpush.resumePush();
        console.log("JPush service starting resume.");

        //5秒后重新确认状态
        setTimeout(() => {
          this.checkStatus();
        }, 60000);
      } else {
        console.log("JPush service is running.");

        if (!this.registerid) {
          await this.getRegistrationID();
        } else {
          if (this.registerid) this.emitService.emit("on.jpush.registerid.loaded");
        }

        if (!this.alias || force) {
          await this.getAlias(userId);
        }

        if (!this.tags || this.tags.length < 0 || force) {
          await this.getAllTags(userId);
        }

      }
    });
  }

  errorHandler(err: any) {
    var sequence: number = err.sequence;
    var code = err.code;
    console.log("JPush Error!" + "\nSequence: " + sequence + "\nCode: " + code);
  }

  getRegistrationID() {
    return new Promise(async (resolve, reject) => {
      this.jpush.getRegistrationID()
      .then((result) => {
        console.log("JPush get registration id " + result);

        if (result) {
          this.registerid = result;
          this.emitService.emit("on.jpush.registerid.loaded");
        }

        resolve();
      }).catch((err) => {
        this.errorHandler(err);
        reject(err);
      });
    });
  }

  getAlias(userId: string): Promise<any> {
    return new Promise(async (resolve, reject) => {
      this.jpush.getAlias({sequence: this.sequence++})
      .then(async (result) => {

        if (result) {
          console.log("JPush get alias " + result.alias);

          this.alias = result.alias;
        } else if (userId) {
          //初始化别名
          await this.setAlias(this.util.getUuid());
        }

        resolve();
      }).catch((err) => {
        this.errorHandler(err);
        reject(err);
      });
    });
  }

  getAllTags(userId: string): Promise<any> {
    return new Promise(async (resolve, reject) => {
      this.jpush.getAllTags({sequence: this.sequence++})
      .then((result) => {

        if (result && result.tags && result.tags.length > 0) {
          console.log("JPush get tags " + result.tags);
          this.tags = result.tags;
        } else if (userId) {
          this.addTags(["mwxing"]);
        }

        resolve();
      }).catch((err) => {
        this.errorHandler(err);
        reject(err);
      });
    });
  }

  setAlias(alias: string): Promise<any> {
    return new Promise(async (resolve, reject) => {
      this.jpush.setAlias({sequence: this.sequence++, alias: alias}).then((result) => {
        var sequence: number = result.sequence;
        this.alias = result.alias;

        resolve();
      }).catch((err) => {
        this.errorHandler(err);
        reject(err);
      });
    });
  }

  addTags(tags: Array<string>): Promise<any> {
    return new Promise(async (resolve, reject) => {
      this.jpush.addTags({sequence: this.sequence++, tags: tags}).then((result) => {
        var sequence: number = result.sequence;

        if (result.tags && result.tags.length > 0) {
          this.tags = tags;
        }

        resolve();
      }).catch((err) => {
        this.errorHandler(err);
        reject(err);
      });
    });
  }
}
