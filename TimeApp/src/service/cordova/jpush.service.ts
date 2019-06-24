import {Injectable} from "@angular/core";
import { JPush, AliasOptions, TagOptions } from '@jiguang-ionic/jpush';
import {EmitService} from "../util-service/emit.service";
import {UtilService} from "../util-service/util.service";
import {DataConfig} from "../config/data.config";
import {Device} from "@ionic-native/device";

/**
 * JPush 极光推送服务
 *
 * create by xilj on 2019/06/19.
 */
@Injectable()
export class JPushService {
  wins: any = window;
  sequence: number = 0;
  alias: string = "";
  registerid: string = "";
  tags: Array<string> = new Array<string>();

  constructor(private jpush: JPush,
              private util: UtilService,
              private device: Device,
              private emitService: EmitService) {
    if (this.util.isMobile()) {
      console.log("JPush service created@" + this.device.platform + ".");

      if (this.device.platform == "Android") {
        document.addEventListener("jpush.receiveNotification", (event) => {
          console.log("JPush Received Notification with event listener.")
          this.notificationReceived(event);
        }, false);

        document.addEventListener("jpush.openNotification", (event) => {
          console.log("JPush Open Notification with event listener.")
          this.notificationOpened(event);
        }, false);

        document.addEventListener("jpush.receiveMessage", (event) => {
          console.log("JPush Received Message with event listener.")
          this.messageReceived(event);
        }, false);
      } else {
        //this.wins.plugins.jPushPlugin.receiveMessageIniOSCallback = (event) => {
        //  _this.messageReceived(_this, event);
        //};
        //this.wins.plugins.jPushPlugin.receiveNotificationIniOSCallback = (event) => {
        //  _this.notificationReceived(_this, event);
        //};
        //this.wins.plugins.jPushPlugin.openNotificationIniOSCallback = (event) => {
        //  _this.notificationOpened(_this, event);
        //};
      }
    }
  }

  //Native Call Function
  notificationReceived(event) {
    console.log("JPush received notification: " + JSON.stringify(event));
  }

  //Native Call Function
  notificationOpened(event) {
    console.log("JPush opened notification: " + JSON.stringify(event));

    if (event.extras['cn.jpush.android.EXTRA']) {
      let extras = event.extras['cn.jpush.android.EXTRA'];

      if (extras && extras['eventdata']) {
        extras['eventdata'] = JSON.parse(extras['eventdata']);
      }

      if (extras['event'] && extras['eventhandler']) {

        let eventname = event.extras['event'];
        let dependson = extras['dependson'];
        let eventdatafrom = extras['eventdatafrom'];
        let eventdata = extras['eventdata'];
        let emitted: number = 0;

        if (eventdatafrom && eventdatafrom == 'local') {

          //共享日程消息点击处理
          if (eventname == "MWXING_SHAREAGENDA_EVENT") {
            let local = {};

            if (eventdata && eventdata['id']) {
              local['sr'] = eventdata['id'];

              console.log("MWxing direct, trigger " + extras['eventhandler'] + " with local data.");
              emitted = this.emitService.emit(extras['eventhandler'], local);
            }
          } else {
            console.log("MWxing direct, trigger " + extras['eventhandler'] + " without payload.");
            emitted = this.emitService.emit(extras['eventhandler']);
          }
        } else {
          console.log("MWxing direct, trigger " + extras['eventhandler'] + " with server data.");
          emitted = this.emitService.emit(extras['eventhandler'], extras);
        }

        // 避免重复触发
        if (!emitted && dependson) {
          //冥王星关闭状态，点击消息启动时，在接收事件初始化之后调用
          let ee = this.emitService.register(dependson, (data) => {
            //冥王星初始化已完成
            console.log("MWxing " + dependson + ", trigger " + extras['eventhandler']);

            if (eventdatafrom && eventdatafrom == 'local') {
              //共享日程消息点击处理
              if (eventname == "MWXING_SHAREAGENDA_EVENT") {
                //如果不存在所属ID则不处理
                if (eventdata && eventdata['id']) {
                  let local = {};

                  //当前保存的共享日程和当前消息指向日程相同
                  local['sr'] = eventdata['id'];

                  this.emitService.emit(extras['eventhandler'], local);
                  ee.unsubscribe();
                }
              } else {
                this.emitService.emit(extras['eventhandler'], data);
                ee.unsubscribe();
              }
            } else {
              this.emitService.emit(extras['eventhandler'], extras);
              ee.unsubscribe();
            }
          });
          console.log("MWxing " + dependson + " registered.")
        }
      }
    }
  }

  //Native Call Function
  messageReceived(event) {
    console.log("JPush received message: " + JSON.stringify(event));
  }

  init() {
    this.jpush.init();
    this.jpush.setDebugMode(DataConfig.isdebug);
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

        if (result && result.alias) {
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
        console.log("JPush add alias responsed with " + JSON.stringify(result));
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
        console.log("JPush add tags responsed with " + JSON.stringify(result));
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

  onMessageReceive(callback) {
    //this.jpush.receiveNotificationInAndroidCallback = callback;
  }

  onMessageOpen(callback) {
    //this.jpush.openNotificationInAndroidCallback = callback;
  }
}
