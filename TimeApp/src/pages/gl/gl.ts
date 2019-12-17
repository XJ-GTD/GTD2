import {Component} from '@angular/core';
import {IonicPage, ModalController, NavController, NavParams, ViewController} from 'ionic-angular';
import {DataConfig} from "../../service/config/data.config";
import {UserConfig} from "../../service/config/user.config";
import {UtilService} from "../../service/util-service/util.service";
import {PageDcData} from "../../data.mapping";
import {GrouperService} from "../../service/business/grouper.service";

/**
 * Generated class for the 群组列表 page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-gl',
  template:
 `
  <page-box title="快捷群组" [buttons]="buttons" (onBack)="goBack()" (onCreate)="toGroupCreate()"  nobackgroud nobottom>
    <ion-scroll scrollY="true" scrollheightAuto>
      <ion-list>
        <ion-list-header>
          <span class="count">{{gl.length}}</span> 个群
        </ion-list-header>
        <ion-item  *ngFor="let g of gl">
          <ion-label (click)="toGroupMember(g)" >
            {{g.gn}}({{g.gc}})
          </ion-label>
          <ion-icon class="fal fa-minus-circle font-large-x" (click)="delGroup(g)"  item-end></ion-icon>
        </ion-item>
      </ion-list>
    </ion-scroll>
  </page-box>
`,
})
export class GlPage {

  buttons: any = {
    create:true,
    cancel: true
  };

  gl:Array<PageDcData> = new Array<PageDcData>();
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public view: ViewController,
              private grouperService:GrouperService,
              public modalCtrl: ModalController,
              public util: UtilService) {
    this.getGroups();

  }


  toGroupMember(g){
    this.modalCtrl.create(DataConfig.PAGE._GC_PAGE,{g:g}).present();
  }

  toGroupCreate(){
    let profileModal = this.modalCtrl.create(DataConfig.PAGE._GA_PAGE);
    profileModal.onDidDismiss((data)=>{
      this.getGroups();
    });
    profileModal.present();
  }

  getGroups(){
    this.gl = UserConfig.groups;
  }

  goBack() {
    this.navCtrl.pop();
  }

  delGroup(g:PageDcData){
    //删除群
    this.util.alterStart("2",()=>{
      this.grouperService.removeGrouper(g.gi).then( data=>{
        this.getGroups();
      }).catch(error=>{
      })
    });

  }
}
