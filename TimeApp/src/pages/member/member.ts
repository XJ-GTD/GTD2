import {Component} from '@angular/core';
import {ModalController, NavController, NavParams, ViewController} from 'ionic-angular';
import {MemberService} from "./member.service";
import {UtilService} from "../../service/util-service/util.service";
import {GlService} from "../gl/gl.service";
import {PageGroupData} from "../../data.mapping";
import {DataConfig} from "../../service/config/data.config";
import {FeedbackService} from "../../service/cordova/feedback.service";
import {Member} from "../../service/business/event.service";

/**
 * Generated class for the 参与人选择 page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-member',
  template: `
    <ion-header no-border>
      <ion-toolbar>
        <ion-buttons left>
          <button ion-button icon-only (click)="goBack()" color="danger">
            <img class="img-header-left" src="./assets/imgs/back-white.png">
          </button>
        </ion-buttons>
        <ion-title>朋友</ion-title>
        <ion-buttons right>
          <button ion-button class="button-header-right" (click)="save()"> 确定
          </button>
        </ion-buttons>
      </ion-toolbar>
      <div class="name-input w-auto">
        <ion-searchbar type="text" placeholder="手机号 姓名" (ionChange)="getContacts()" [(ngModel)]="tel"
                   text-center></ion-searchbar>
      </div>
    </ion-header>

    <ion-content padding>
      <div class="selected">
        <ion-chip *ngFor="let member of selMemberList" (click)="rmSelected(member)">
          <ion-avatar>
            <img src={{member.bhiu}}>
          </ion-avatar>
          <ion-label>{{member.ran}}</ion-label>
        </ion-chip>
      </div>
      <ion-grid>
        <ion-row *ngFor="let g of pageGrouList" class="group">
          <ion-avatar item-start>
            <img src={{g.gm}}>
          </ion-avatar>
          <ion-label>
            {{g.gn}}({{g.gc}})
          </ion-label>
          <ion-checkbox (click)="addGroupList(g)" [(ngModel)]="g.checked"></ion-checkbox>
        </ion-row>
        <ion-row *ngFor="let member of pageMemberList">
          <ion-avatar item-start (click)="goTofsDetail(member)">
            <img [src]="member.bhiu">
          </ion-avatar>
          <ion-label (click)="goTofsDetail(member)">
            {{member.ran}}
            <!--<span> {{g.rc}}</span>-->
            <span *ngIf="member.rel ==1">注册</span>
          </ion-label>
          <ion-checkbox (click)="addsel(member)" [(ngModel)]="member.checked"></ion-checkbox>
        </ion-row>
      </ion-grid>
    </ion-content>
  `,
})
export class MemberPage {
  statusBarColor: string = "#3c4d55";

  tel: any;//手机号
  pageMemberList: Array<MemberPageData> = new Array<MemberPageData>();
  pageGrouList: Array<PageGroupData> = new Array<PageGroupData>();
  selMemberList: Array<Member> = new Array<Member>();

  constructor(public navCtrl: NavController,
              public viewCtrl: ViewController,
              public navParams: NavParams,
              private memberService: MemberService,
              private util: UtilService,
              private glService: GlService,
              private  modalCtrl: ModalController,private feedback:FeedbackService) {
  }

  ionViewDidEnter() {
    if (this.navParams && this.navParams.data ) {
      if (this.navParams.data.members){
        Object.assign(this.selMemberList , this.navParams.data.members);
      }else{
        this.selMemberList = new Array<Member>();
      }
    }
    this.getContacts();
  }

  rmSelected(member: Member) {
    let index: number = this.selMemberList.findIndex((value) => {
      return member.pwi == value.pwi;
    });
    this.selMemberList.splice(index, 1);
    this.checkedSet();
  }

  save() {
    let list = this.selMemberList;
    if (list.length > 0) {
      let data: Object = {
        members : list
      };
      this.viewCtrl.dismiss(data);
    } else {
      this.util.popoverStart("请选择参与人");
    }

  }

  addsel(member: MemberPageData) {

    if (member.checked) {
      this.selMemberList.push(member);
    } else {
      let index: number = this.selMemberList.findIndex((value) => {
        return member.pwi == value.pwi;
      });
      this.selMemberList.splice(index, 1);
    }
  }

  addGroupList(g: PageGroupData) {
    if (g.checked) {
      for (let member of g.members) {
        let index: number = this.selMemberList.findIndex((value) => {
          return member.pwi == value.pwi;
        });
        if (index < 0) {
          this.selMemberList.push(member);
        }
      }
    } else {
      for (let f of g.members) {
        let index: number = this.selMemberList.findIndex((value) => {
          return f.pwi == value.pwi;
        });
        this.selMemberList.splice(index, 1);
      }
    }

    this.checkedSet();
  }

  goBack(page: any, para: any) {
    this.navCtrl.pop();
  }

  getContacts() {
    this.pageGrouList.length = 0;
    this.pageMemberList.length = 0;
    let groupList = this.glService.getMemberGroups(this.tel);
    let memberList = this.memberService.getMembers(this.tel);
    groupList.forEach((value) => {
      let group: PageGroupData = new PageGroupData();
      Object.assign(group, value);
      this.pageGrouList.push(group);

    });
    memberList.forEach((value) => {
      let member: MemberPageData = {} as MemberPageData;
      Object.assign(member, value);
      member.checked = false;
      this.pageMemberList.push(member);
    });
    this.checkedSet();
  }

  checkedSet() {
    this.pageMemberList.forEach((value,index,arr) => {
      value.checked = false;
      let t = this.selMemberList.find(member => {
        return value.pwi == member.pwi;
      });
      if (t){
        value.checked = true;
      }
    });
  }

/*  goTofsDetail(fs: FsData) {
    let modal = this.modalCtrl.create(DataConfig.PAGE._FD_PAGE, {fsData: fs});
    modal.present();
  }*/
}

/**
 * 联系人视图
 */
export interface MemberPageData extends  Member{
  checked:boolean ;
}
