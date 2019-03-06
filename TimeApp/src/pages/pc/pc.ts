import {Component, ViewChild} from '@angular/core';
import {IonicPage, Navbar, NavController} from 'ionic-angular';
import {JhService} from "../../service/jh.service";

/**
 * Generated class for the PcPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-pc',
  template:'<ion-header>' +
  '  <ion-navbar>' +
  '    <ion-title>添加计划</ion-title>' +
  '    <ion-buttons right>' +
  '      <button ion-button (click)="save()">保存</button>' +
  '    </ion-buttons>' +
  '  </ion-navbar>' +
  '</ion-header>' +
  '<ion-content padding>' +
  '  <!--<ion-list>-->' +
  '    <ion-item>' +
  '      <ion-label>计划名称</ion-label>' +
  '      <ion-input [(ngModel)]="jhmc"></ion-input>' +
  '    </ion-item>' +
  '    <div style="display: flex; font-size:1.7rem;" class="bortom" padding-left>' +
  '      <div col-3 no-padding>' +
  '        <div class="margin181">计划描述</div>' +
  '      </div>' +
  '      <div col-9>' +
  '        <ion-textarea style="border:1px solid #cccccc;" col-12 [(ngModel)]="jhms"></ion-textarea>' +
  '      </div>' +
  '    </div>' +
  '</ion-content>',
})
export class PcPage {

  @ViewChild(Navbar) navBar: Navbar;

  jhmc:string;
  jhms:string;

  constructor(private navCtrl: NavController,
              private jhService: JhService) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PcPage');
    this.navBar.backButtonClick = this.backButtonClick;
    this.navBar.setBackButtonText("");
  }

  backButtonClick = (e: UIEvent) => {
    // 重写返回方法
    this.navCtrl.pop();
  };

  save(){
    console.log("计划添加 :: 计划名称 " + this.jhmc +　" 计划描述 " + this.jhms );
    if(this.jhmc === undefined || this.jhms === undefined){
      alert("输入项有为空");
      return;
    }
    this.jhService.ajh(this.jhmc,this.jhms).then(data=>{
      console.log("计划添加成功 :: " + JSON.stringify(data));
      this.navCtrl.pop();
    }).catch(reason => {
      console.log("计划添加失败 :: " + JSON.stringify(reason));
    })
  }
}
