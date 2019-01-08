import {Component, ElementRef} from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { PopoverController } from 'ionic-angular';
import {DwEmitService} from "../../service/util-service/dw-emit.service";
import {PageConfig} from "../../app/page.config";

/**
 * Generated class for the AdPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-ad',
  templateUrl: 'ad.html',
})
export class AdPage {

  constructor(private navCtrl: NavController,
              private navParams: NavParams,
              private dwEmit: DwEmitService,
              private element: ElementRef) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AdPage');
  }

  test($event) {
    alert("测试adpage");
  }

  updateEditor(){
    let el = this.element.nativeElement.querySelector("textarea");
    el.style.overflow = "hidden";
    el.style.height = "auto";
    if (el['scrollHeight'] >= 120) { //给输入框设定一个最小的高度
      el['style'].height = el['scrollHeight'] + "px";
    }else {
      el['style'].height = "120px";
    }
  }

  // ionViewDidLoad(){
  //   console.log("1.0 ionViewDidLoad 当页面加载的时候触发，仅在页面创建的时候触发一次，如果被缓存了，那么下次再打开这个页面则不会触发");
  // }
  // ionViewWillEnter(){
  //   console.log("2.0 ionViewWillEnter 顾名思义，当将要进入页面时触发");
  // }
  // ionViewDidEnter(){
  //   console.log("3.0 ionViewDidEnter 当进入页面时触发");
  // }
  // ionViewWillLeave(){
  //   console.log("4.0 ionViewWillLeave 当将要从页面离开时触发");
  // }
  // ionViewDidLeave(){
  //   console.log("5.0 ionViewDidLeave 离开页面时触发");
  // }
  // ionViewWillUnload(){
  //   console.log("6.0 ionViewWillUnload 当页面将要销毁同时页面上元素移除时触发");
  // }
  //
  // ionViewCanEnter(){
  //   console.log("ionViewCanEnter");
  // }
  //
  // ionViewCanLeave(){
  //   console.log("ionViewCanLeave");
  // }

}
