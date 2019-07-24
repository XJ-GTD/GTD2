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
      }
    }
  }

  //Native Call Function
  messageReceived(event) {
    console.log("RabbitMQ received message: " + JSON.stringify(event));
  }
}
