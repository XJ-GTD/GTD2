import {Component, Renderer2, ViewChild} from '@angular/core';
import {Label, ModalController, NavController, NavParams, ViewController} from 'ionic-angular';
import {UtilService} from "../../service/util-service/util.service";
import {DataConfig} from "../../service/config/data.config";
import {ModalBoxComponent} from "../../components/modal-box/modal-box";
import {Member} from "../../service/business/event.service";
import * as anyenum from "../../data.enum";
/**
 * Generated class for the 参与人选择 page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-invites',
  template: `
    <modal-box title="参与人" [buttons]="buttons" (onSave)="save()" (onCancel)="cancel()">

      <ion-list>
        <ion-list-header>
          参与人(<span class="count">{{this.memberSet.members.length}}</span>)
        </ion-list-header>
        <ion-item >
          <ion-label #membercom class="somemmember">
            <ul>
                <li *ngFor = "let member of memberSet.members; let i = index" (click)="removeMember(i)">
                  <span [class.accepted] = "member.ui == this.pubui || member.sdt == accepted"> {{ member.ran  }}
                    <!--<ion-icon class="fal fa-hands-helping accepted font-small-x" *ngIf="member.ui == this.pubui || member.sdt == accepted"></ion-icon>-->
                  </span>
                </li>
              <li (click)="openMemberSelect()" *ngIf="canCreate">
                <span class="addMember"><ion-icon class="fal fa-plus-square"></ion-icon></span>
              </li>
              <li></li>
            </ul>
          </ion-label>
        </ion-item>
        <span *ngIf="memberSet.members.length / 4 > 7 && showall" (click) ="showMember()" class="showMember">查看全部参与人</span>
        <span *ngIf="memberSet.members.length / 4 > 7 && !showall" (click) ="showMember()"class="showMember">收起</span>
      </ion-list>
      <ion-list>
        <ion-list-header>
          参与人权限设置<p class="help-inline">仅发起人可设置</p>
        </ion-list-header>
        <ion-item>
          <ion-label>转发<p class="help-inline">参与人<span *ngIf="!memberSet.iv">不</span>可以邀请他人</p></ion-label>
          <ion-toggle [(ngModel)]="memberSet.iv"  [disabled]="!powerEnable" ></ion-toggle>
        </ion-item>
        <ion-item>
          <ion-label>编辑<p class="help-inline">参与人<span *ngIf="!memberSet.md">不</span>可以修改</p></ion-label>
          <ion-toggle [(ngModel)]="memberSet.md" [disabled]="!powerEnable"></ion-toggle>
        </ion-item>
      </ion-list>
    </modal-box>
  `,
})
export class InvitesPage {

  @ViewChild(ModalBoxComponent)
  modalBoxComponent:ModalBoxComponent;
  @ViewChild("membercom")
  membercom:any;


  powerEnable : boolean = false; //设定控制
  inviteEnable: boolean = false;
  pubui : string;

  accepted:anyenum.MemberShareState = anyenum.MemberShareState.Accepted

  canCreate:boolean = false;

  buttons: any = {
    save: true,
    cancel: true
  };

  memberSet : any = {
    members : new Array<Member>(),
    md : true,
    iv : true,
    mine:true
  }

  showall:boolean = true;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public viewCtrl: ViewController,
              private util: UtilService,
              private  modalCtrl: ModalController,
              private renderer2: Renderer2) {

    //下面处理需要放在构造方法里，防止关闭参与人选择页面时进入该处理
    if (this.navParams && this.navParams.data ) {
      this.memberSet.members = this.navParams.data.members?this.navParams.data.members : new Array<Member>();
      this.pubui = this.navParams.data.ui;
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

      this.memberSet.mine = this.navParams.data.mine;
      if (this.memberSet.mine){
        this.powerEnable = true;
        this.inviteEnable = true;
        this.canCreate = true;
      }else{
        this.powerEnable = false;
        this.inviteEnable = this.memberSet.iv;
        this.canCreate = this.memberSet.iv;
        this.buttons.save = this.memberSet.iv;
      }

      if (!this.memberSet.members || this.memberSet.members.length ==0){

        this.openMemberSelect();
      }
    }
  }

  showMember(){
    if (this.showall)
    this.renderer2.removeClass(this.membercom.nativeElement, "somemmember");
    else
    this.renderer2.addClass(this.membercom.nativeElement, "somemmember");

    this.showall = !this.showall;
  }

  ionViewDidEnter() {
    this.modalBoxComponent.setBoxContent();

  }

  save(){

    let data: Object = {
      members : this.memberSet.members,
      md : this.memberSet.md ? anyenum.ModiPower.enable : anyenum.ModiPower.disable,
      iv : this.memberSet.iv ? anyenum.InvitePowr.enable : anyenum.InvitePowr.disable
    };
    this.viewCtrl.dismiss(data);
  }

  cancel(){
    this.navCtrl.pop();
  }

  removeMember(index: number) {
    if (!this.memberSet.mine){
      return;
    }
    this.memberSet.members.splice(index, 1);
  }

  memberAcceptColor(member : Member){
    let ret = 'gray';
    if (member.ui == this.pubui){
      ret = 'green';
    }else if ( member.sdt && member.sdt == anyenum.MemberShareState.Accepted ){
      ret =  'green';
    }else{
      ret =  'gray';
    }

    return ret;
  }

  openMemberSelect(){
    let modal = this.modalCtrl.create(DataConfig.PAGE._MEMBER_PAGE,
      {});
    modal.onDidDismiss(async (data) => {
      if (data && data.members && data.members.length > 0) {
        let exists = this.memberSet.members.reduce((target, val) => {
          target.push(val.rc);

          return target;
        }, new Array<string>());

        data.members.forEach((v)=>{
           if (exists.indexOf(v.rc) < 0) {
            this.memberSet.members.push(v);
           }
        })
      }

    });
    modal.present();
  }
}
