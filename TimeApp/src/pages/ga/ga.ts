import {Component, ViewChild} from '@angular/core';
import {IonicPage, NavController, NavParams, ViewController} from 'ionic-angular';
import {GcService, PageDcData} from "../gc/gc.service";
import {UtilService} from "../../service/util-service/util.service";


/**
 * Generated class for the GaPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 * 添加群组
 */

@IonicPage()
@Component({
  selector: 'page-ga',
  template:  `
  <ion-header no-border>
    <ion-toolbar>
      <ion-buttons left>
        <button ion-button icon-only (click)="goBack()" color="danger">
            <img class="img-header-left" src="./assets/imgs/fh2.png">
        </button>
      </ion-buttons>
  
      <ion-buttons right>
        <button ion-button color="danger" (click)="save()">
          保存
        </button>
      </ion-buttons>
    </ion-toolbar>
  </ion-header>
  
  <ion-content padding>
  <ion-grid>
    <ion-row justify-content-center>
      <div class="name-input w-auto">
      <ion-input #nameInput type="text" placeholder="输入群组名称" [(ngModel)]="tt"  text-center></ion-input>
      </div>
    </ion-row>   
  </ion-grid>
  </ion-content>
`,
})
export class GaPage {
  tt:string;
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public viewCtrl: ViewController,
              private util:UtilService,
              private gcService:GcService,) {
  }
  @ViewChild('nameInput') nameInput ;
  ionViewDidLoad() {
    console.log('ionViewDidLoad GaPage');
  }

  ionViewDidEnter(){
    console.log("3.0 ionViewDidEnter 当进入页面时触发");
    setTimeout(() => {
      this.nameInput.setFocus();//为输入框设置焦点
    },150);
  }

  goBack(){
    console.log('GaPage跳转GlPage');
    this.viewCtrl.dismiss();
  }
  //保存群名称
  save(){
    let dc:PageDcData = new PageDcData();
    dc.gn = this.tt;
    if(!this.tt || this.tt == null || this.tt==''){
      this.util.toast("群名称不能为空",2000);
      return;
    }
    // this.util.popMsgbox("1",()=>{
      this.gcService.save(dc).then(data=> {
        if (data.code == 0) {
          this.viewCtrl.dismiss();
        }else{
          this.util.toast("添加群名称失败",2000);
        }
      })
    // });
  }


}
