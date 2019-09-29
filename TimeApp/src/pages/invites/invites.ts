import {Component, ViewChild} from '@angular/core';
import {ModalController, NavController, NavParams, ViewController} from 'ionic-angular';
import {UtilService} from "../../service/util-service/util.service";
import {FsData, FsPageData, PageGroupData} from "../../data.mapping";
import {DataConfig} from "../../service/config/data.config";
import {ModalBoxComponent} from "../../components/modal-box/modal-box";
import {Member} from "../../service/business/event.service";
import * as anyenum from "../../data.enum";
import {InvitePowr} from "../../data.enum";
/**
 * Generated class for the 参与人选择 page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-invites',
  template: `
    <modal-box title="邀请人" [buttons]="buttons" (onSave)="save()" (onCancel)="cancel()">
      <ion-list>
        <ion-list-header>
          参与人({{parternum}})
          <button ion-button clear item-end (click) = "openMemberSelect()">
            <ion-icon ios="ios-add" md="md-add"></ion-icon>
          </button>
        </ion-list-header>
        <ion-item>
          <div *ngFor = "let parter of parterSet.parters">
            {{ parter.ran }}
          </div>
        </ion-item>
        <ion-item no-lines >
          <button ion-button clear item-end>查看全部参与人</button>
        </ion-item>
      </ion-list>
      <ion-list>
        <ion-item>
          <ion-label>转发</ion-label>
          <ion-toggle [(ngModel)]="parterSet.iv" ></ion-toggle>
        </ion-item>
        <ion-item>
          <ion-label>编辑</ion-label>
          <ion-toggle [(ngModel)]="parterSet.md"></ion-toggle>
        </ion-item>
      </ion-list>
    </modal-box>
  `,
})
export class InvitesPage {

  @ViewChild(ModalBoxComponent)
  modalBoxComponent:ModalBoxComponent

  buttons: any = {
    remove: false,
    share: false,
    save: true,
    cancel: true
  };

  memberSet : any = {
    members : new Array<Member>(),
    md : false,
    iv : false,
  }

  membernum : "";

  tel: any;//手机号

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public viewCtrl: ViewController,
              private util: UtilService,
              private  modalCtrl: ModalController) {
  }

  ionViewDidEnter() {
    this.modalBoxComponent.setBoxContent();

    if (this.navParams && this.navParams.data ) {
      this.memberSet.members = this.navParams.data.members;
      this.membernum = this.memberSet.members.length;
      if (this.navParams.data.iv == anyenum.InvitePowr.enable){
        this.memberSet.iv = true;
      }else{
        this.memberSet.iv = false;
      }
      if (this.navParams.data.md == anyenum.ModiPower.enable){
        this.memberSet.md = true;
      }else{
        this.memberSet.md = false;
      }
    }

  }

  goTofsDetail(fs: FsData) {
    let modal = this.modalCtrl.create(DataConfig.PAGE._FD_PAGE, {fsData: fs});
    modal.present();
  }

  save(){
    console.log("this.memberSet.iv:"+this.memberSet.iv);
    console.log("this.memberSet.md:"+this.memberSet.md);

    /*let data: Object = {

    };
    this.viewCtrl.dismiss(data);*/
  }

  cancel(){
    this.navCtrl.pop();
  }

  openMemberSelect(){
    let modal = this.modalCtrl.create(DataConfig.PAGE._MEMBER_PAGE,
      {
        members : this.memberSet.members
      });
    modal.onDidDismiss(async (data) => {

    });
    modal.present();
  }
}
