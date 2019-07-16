import {Injectable} from "@angular/core";
import {EmitService} from "../util-service/emit.service";
import {UtilService} from "../util-service/util.service";
import {DataConfig} from "../config/data.config";
import {Device} from "@ionic-native/device";

@Injectable()
export class MIPushService {
  constructor(private util: UtilService,
              private device: Device,
              private emitService: EmitService) {
      if (this.util.isMobile()) {
        console.log("MIPush service created@" + this.device.platform + ".");

        if (this.device.platform == "Android") {
          document.addEventListener("mipush.receiveRegisterResult", (event) => {
            console.log("MIPush Received Notification with event listener.")
            this.notificationReceived(event);
          }, false);

          document.addEventListener("mipush.notificationMessageArrived", (event) => {
            console.log("MIPush Received Notification with event listener.")
            this.notificationReceived(event);
          }, false);

          document.addEventListener("mipush.notificationMessageClicked", (event) => {
            console.log("MIPush Received Notification with event listener.")
            this.notificationReceived(event);
          }, false);
      }
    }
  }

  notificationReceived(event) {
    console.log("MIPush received notification: " + JSON.stringify(event));
  }
}
