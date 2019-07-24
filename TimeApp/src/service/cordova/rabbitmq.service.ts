import {Injectable} from "@angular/core";
import {EmitService} from "../util-service/emit.service";
import {UtilService} from "../util-service/util.service";
import {DataConfig} from "../config/data.config";
import {Device} from "@ionic-native/device";

/**
 * RabbitMQ推送服务
 *
 * create by xilj on 2019/06/19.
 */
@Injectable()
export class RabbitMQService {
  wins: any = window;//window对象

  constructor(private util: UtilService,
              private device: Device,
              private emitService: EmitService) {
    if (this.util.isMobile()) {
      console.log("RabbitMQ service created@" + this.device.platform + ".");

      if (this.device.platform == "Android") {
        document.addEventListener("rabbitmq.receivedMessage", (event) => {
          console.log("RabbitMQ Received Message with event listener.")
          this.messageReceived(event);
        }, false);
      } else {
        console.log("RabbitMQ running outside android.");
      }
    } else {
      console.log("RabbitMQ service not created.");
    }
  }

  //Native Call Function
  messageReceived(event) {
    this.emitService.emit('rabbitmq.message.received', event);
    console.log("RabbitMQ received message: " + JSON.stringify(event['header']));
    console.log("RabbitMQ received message: " + JSON.stringify(event['content']));
  }

  init(uid: string, deviceid: string, queuename: string) {
    if (uid && deviceid && queuename) {
      this.wins.cordova.plugins.RabbitMQPlugin.init(uid, deviceid, queuename);
    } else {
      console.log("Not enough parameters for RabbitMQ initializing.");
    }
  }
}
