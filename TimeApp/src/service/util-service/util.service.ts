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

  public checkPhone(str){
    if(str == undefined|| str == null || str == ''){
      return 0;//输入为空
    }
    if(str.length != 11){
      return 1;//长度小于11
    }
    let regex = /^((13[0-9])|(14[5,7,9])|(15([0-3]|[5-9]))|(166)|(17[0,1,3,5,6,7,8])|(18[0-9])|(19[8|9]))\d{8}$/;
    let isPhone = regex.test(str);
    if(isPhone){
      return 3;//手机号正确
    }else{
      return 2;//手机号格式错误
    }

  }
}
