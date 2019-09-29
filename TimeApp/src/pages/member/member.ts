import {Component} from '@angular/core';
import {ModalController, NavController, NavParams} from 'ionic-angular';
import {MemberService} from "./member.service";
import {FdService} from "../fd/fd.service";
import {UtilService} from "../../service/util-service/util.service";
import {GlService} from "../gl/gl.service";
import {FsData, FsPageData, PageGroupData} from "../../data.mapping";
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
        <ion-chip *ngFor="let g of selMemberList" (click)="rmSelected(g)">
          <ion-avatar>
            <img src={{g.bhiu}}>
          </ion-avatar>
          <ion-label>{{g.ran}}</ion-label>
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
        <ion-row *ngFor="let g of pageMemberList">
          <ion-avatar item-start (click)="goTofsDetail(g)">
            <img [src]="g.bhiu">
          </ion-avatar>
          <ion-label (click)="goTofsDetail(g)">
            {{g.ran}}
            <!--<span> {{g.rc}}</span>-->
            <span *ngIf="g.rel ==1">注册</span>
          </ion-label>
          <ion-checkbox (click)="addsel(g)" [(ngModel)]="g.checked"></ion-checkbox>
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
              public navParams: NavParams,
              private memberService: MemberService,
              private util: UtilService,
              private fdService: FdService,
              private glService: GlService,
              private  modalCtrl: ModalController,private feedback:FeedbackService) {
  }

  ionViewDidEnter() {
    if (this.navParams && this.navParams.data ) {
      this.selMemberList = this.navParams.data.parters;
    }
    this.getContacts();
  }

  rmSelected(fs: FsData) {
    let index: number = this.selMemberList.findIndex((value) => {
      return fs.pwi == value.pwi;
    });
    this.selMemberList.splice(index, 1);
    this.checkedSet();
  }

  save() {
    let list = this.selMemberList;
    if (list.length > 0) {
      this.memberService.shareMember(this.navParams.get('tpara'), list).then(data => {
        this.feedback.audioSend();

        this.navCtrl.popAll();

      });
    } else {
      this.util.popoverStart("请先选择朋友");
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
    let groupList = this.glService.getGroups(this.tel);
    let parterList = this.memberService.getMembers(this.tel);
    groupList.forEach((value) => {
      let group: PageGroupData = new PageGroupData();
      Object.assign(group, value);
      this.pageGrouList.push(group);

    });
    parterList.forEach((value) => {
      let parter: MemberPageData = {} as MemberPageData;
      Object.assign(parter, value);
      parter.checked = false;
      this.pageMemberList.push(parter);
    });
    this.checkedSet();
  }

  checkedSet() {
    this.pageMemberList.forEach((value,index,arr) => {
      value.checked = false;
      let t = this.selMemberList.find(parter => {
        return value.pwi == parter.pwi;
      });
      if (t){
        value.checked = true;
      }
    });
  }

  goTofsDetail(fs: FsData) {
    let modal = this.modalCtrl.create(DataConfig.PAGE._FD_PAGE, {fsData: fs});
    modal.present();
  }
}

/**
 * 联系人视图
 */
export interface MemberPageData extends  Member{
  checked:boolean ;
}
