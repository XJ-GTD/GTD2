import {Component, ViewChild} from '@angular/core';
import {IonicPage, NavController, NavParams, ViewController} from 'ionic-angular';
import {UtilService} from "../../service/util-service/util.service";
import {PageDcData} from "../../data.mapping";
import {GrouperService} from "../../service/business/grouper.service";


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

    <modal-box title="添加群组" [buttons]="buttons" (onSave)="save()" (onCancel)="goBack()">
      <ion-input  #nameInput placeholder="输入群组名称"  class="memo-set" rows="8" [(ngModel)]="tt" class="font-large-x"></ion-input>
    </modal-box>
`,
})
export class GaPage {
  buttons: any = {
    save:true,
    cancel: true
  };
  tt:string;
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public viewCtrl: ViewController,
              private util:UtilService,
              private grouperService:GrouperService,) {
  }
  @ViewChild('nameInput') nameInput ;
  ionViewDidLoad() {
  }

  ionViewDidEnter(){
    setTimeout(() => {
      this.nameInput.setFocus();//为输入框设置焦点
    },150);
  }

  goBack(){
    this.viewCtrl.dismiss();
  }
  //保存群名称
  save(){
    let dc:PageDcData = new PageDcData();
    dc.gn = this.tt;
    if(!this.tt || this.tt == null || this.tt==''){
      this.util.popoverStart("群名称不能为空");
      return;
    }
    // this.util.popMsgbox("1",()=>{
      this.grouperService.saveGrouper(dc).then(data=> {
        if (data) {
          this.viewCtrl.dismiss();
        }else{
          this.util.popoverStart("添加群名称失败");
        }
      })
    // });
  }


}
