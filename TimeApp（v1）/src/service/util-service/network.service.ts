import {Injectable} from "@angular/core";
import {Network} from "@ionic-native/network";
import {ToastController} from "ionic-angular";
import {DataConfig} from "../../app/data.config";

/**
 * 网络监控工具类
 *
 * create by wzy on 2019/01/15
 */
@Injectable()
export class NetworkService {

  constructor(private network: Network,
              private toastCtrl: ToastController) { }

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
    let toast = this.toastCtrl.create({
      message: '',
      duration: 1500,
      position: 'top'
    });

    // watch network for a disconnection
    let disconnectSubscription = this.network.onDisconnect().subscribe(() => {
      console.log('network was disconnected :-(');
      console.log('没有连接网络');
      DataConfig.IS_NETWORK_CONNECT = false;

      toast.setMessage('当前无网络，请检查网络连接');
      toast.onDidDismiss(() => {
        console.log('Dismissed toast');
      });
      toast.present();

    });

    // watch network for a connection
    let connectSubscription = this.network.onConnect().subscribe(() => {
      console.log('network connected!');
      console.log('网络成功连接');
      DataConfig.IS_NETWORK_CONNECT = true;

      toast.setMessage('网络成功连接');
      toast.onDidDismiss(() => {
        console.log('Dismissed toast');
      });
      toast.present();
    });

  }
}
