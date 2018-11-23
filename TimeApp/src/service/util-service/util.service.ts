import {Injectable} from "@angular/core";
import {Device} from "@ionic-native/device";

/**
 * 公共方法
 *
 * create by wzy on 2018/07/22.
 */
@Injectable()
export class UtilService {

  constructor(public device: Device) {}

  public static rand(min, max ) {
    return Math.random() * ( max - min ) + min;
  }

  public static randInt(min, max ) {
    return Math.floor( min + Math.random() * ( max - min + 1 ) );
  };

  public getUuid() {
    let CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');

    let uuid = function (len, radix) {
      var chars = CHARS, uuid = [], i;
      radix = radix || chars.length;

      if (len) {
        // Compact form
        for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random()*radix];
      } else {
        // rfc4122, version 4 form
        var r;

        // rfc4122 requires these characters
        uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
        uuid[14] = '4';

        // Fill in random data.  At i==19 set the high bits of clock sequence as
        // per rfc4122, sec. 4.1.5
        for (i = 0; i < 36; i++) {
          if (!uuid[i]) {
            r = 0 | Math.random()*16;
            uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
          }
        }
      }

      return uuid.join('');
    };

    return uuid(32, 16);
  }

  public getDeviceId() {
    let deviceId = this.device.uuid;
    return deviceId;
  }
}
