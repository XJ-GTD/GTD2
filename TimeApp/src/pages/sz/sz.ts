import {Component, ViewChild} from '@angular/core';
import {IonicPage, Navbar, NavController, NavParams} from 'ionic-angular';
import {JhService} from "../../service/jh.service";

/**
 * Generated class for the SzPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-sz',
  // templateUrl: 'sz.html',
  template:'<ion-header>\n' +
  '\n' +
  '  <ion-navbar>\n' +
  '    <ion-title>添加计划</ion-title>\n' +
  '    <ion-buttons right>\n' +
  '      <button ion-button (click)="save()">保存</button>\n' +
  '    </ion-buttons>\n' +
  '  </ion-navbar>\n' +
  '\n' +
  '</ion-header>\n' +
  '\n' +
  '\n' +
  '<ion-content padding>\n' +
  '  <!--<ion-list>-->\n' +
  '    <ion-item>\n' +
  '      <ion-label>计划名称</ion-label>\n' +
  '      <ion-input [(ngModel)]="jhmc"></ion-input>\n' +
  '    </ion-item>\n' +
  '\n' +
  '    <div style="display: flex; font-size:1.7rem;" class="bortom" padding-left>\n' +
  '      <div col-3 no-padding>\n' +
  '        <div class="margin181">计划描述</div>\n' +
  '      </div>\n' +
  '      <div col-9>\n' +
  '        <ion-textarea style="border:0.5px solid #cccccc;" col-12 [(ngModel)]="jhms"></ion-textarea>\n' +
  '      </div>\n' +
  '    </div>\n' +
  '\n' +
  '\n' +
  '</ion-content>\n',
})
export class SzPage {

  @ViewChild(Navbar) navBar: Navbar;

  jhmc:string;
  jhms:string;

  constructor(private navCtrl: NavController,
              private navParams: NavParams,
              private jhService: JhService) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SzPage');
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
