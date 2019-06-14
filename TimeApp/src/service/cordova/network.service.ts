import {Injectable} from "@angular/core";
import {Network} from "@ionic-native/network";
import {DataConfig} from "../config/data.config";
import {UtilService} from "../util-service/util.service";
import {EmitService} from "../util-service/emit.service";

/**
 * 网络监控工具类
 *
 * create by wzy on 2019/01/15
 */
@Injectable()
export class NetworkService {

  constructor(private network: Network,
              private util: UtilService,
              private emitService: EmitService) { }

  /**
   * 返回当前网络连接类型
   */
  public getNetworkType() {
    if(this.network.type === 'unknown') {
      console.log('这是一个未知的网络连接，可能不安全，请小心！');
    } else if(this.network.type === 'none') {
      console.log('没有连接网络');
    } else {
      console.log('we got a ' + this.network.type + ' connection, woohoo!');
    }
    return this.network.type;
  }

  /**
   * 网络状态监控
   */
  public monitorNetwork() {

    // 初始化的时候，网络状态设置
    if (this.network.type === 'none') {
      DataConfig.IS_NETWORK_CONNECT = false;
    }

    // watch network for a disconnection
    let disconnectSubscription = this.network.onDisconnect().subscribe(() => {
      console.log('network was disconnected :-(');
      console.log('没有连接网络');
      DataConfig.IS_NETWORK_CONNECT = false;

      this.emitService.emit("on.network.disconnected");
      this.util.toastStart("当前无网络，请检查网络连接",1500);

    });

    // watch network for a connection
    let connectSubscription = this.network.onConnect().subscribe(() => {
      console.log('network connected!');
      console.log('网络成功连接');
      DataConfig.IS_NETWORK_CONNECT = true;

      this.emitService.emit("on.network.connected");
      //this.util.toastStart("网络成功连接",1500);
    });

  }
}
