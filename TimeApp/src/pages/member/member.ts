import {Component, Renderer2} from '@angular/core';
import {ModalController, NavController, NavParams, ViewController} from 'ionic-angular';
import {MemberService} from "./member.service";
import {UtilService} from "../../service/util-service/util.service";
import {FsData, FsPageData, PageGroupData} from "../../data.mapping";
import {DataConfig} from "../../service/config/data.config";
import {FeedbackService} from "../../service/cordova/feedback.service";
import {Member} from "../../service/business/event.service";
import {UserConfig} from "../../service/config/user.config";
import {Friend, GrouperService} from "../../service/business/grouper.service";

/**
 * Generated class for the 参与人选择 page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-member',
  template: `

    <modal-box title="邀请人" [buttons]="buttons" (onSave)="save()" (onCancel)="goBack()">

      <div class="searchbar">
        <ion-searchbar type="text" placeholder="输入手机号或者姓名" (ionChange)="getContacts()" [(ngModel)]="tel"
                       text-center></ion-searchbar>
      </div>

      <ion-scroll scrollY="true" scrollheightAuto>
        <!--<ion-list>-->
          <!--<ion-item >-->
            <!--<ion-label class="somemmember">-->
              <!--<ul>-->
                <!--<li *ngFor = "let member of selMemberList" (click)="rmSelected(member)">-->
                  <!--<span> {{ member.ran }}</span>-->
                <!--</li>-->
                <!--<li>-->
                <!--</li>-->
              <!--</ul>-->
            <!--</ion-label>-->
          <!--</ion-item>-->
        <!--</ion-list>-->

        <ion-list >
          <ion-item *ngFor="let g of pageGrouList" >
            <ion-label class="selected">
              {{g.gn}}
              <span float-right>
              <ion-icon class="fad fa-users"></ion-icon>（{{g.gc}}）</span>
            </ion-label>
            <ion-checkbox (click)="addGroupList(g)" [(ngModel)]="g.checked"></ion-checkbox>
          </ion-item>
          <ion-item *ngFor="let member of pageFsList" >
            <ion-label [class.chooseed] = "member.checked">
              {{member.ran}}
              <span *ngIf="member.rel ==1" float-right class="reg">注册</span>
              <span *ngIf="member.rel !=1" float-right class="reg">未注册</span>
              <span float-right class="tel">{{member.rc | formatstring: "maskphone":3:5}}</span>
            </ion-label>
            <ion-checkbox (click)="addsel(member)" [(ngModel)]="member.checked"></ion-checkbox>
          </ion-item>
        </ion-list>
      </ion-scroll>

    </modal-box>
  `,
})
export class MemberPage {


  buttons: any = {
    remove: false,
    share: false,
    create:false,
    save: true,
    cancel: true
  };

  tel: any;//手机号
  pageFsList: Array<FsPageData> = new Array<FsPageData>();
  pageGrouList: Array<PageGroupData> = new Array<PageGroupData>();
  selMemberList: Array<Member> = new Array<Member>();

  constructor(public navCtrl: NavController,
              public viewCtrl: ViewController,
              public navParams: NavParams,
              private memberService: MemberService,
              private util: UtilService,
              private grouperService: GrouperService,
              private  modalCtrl: ModalController,private feedback:FeedbackService) {
  }

  ionViewDidEnter() {

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

  addsel(fs: FsPageData) {

    let member = {} as Member;
    if (fs.checked) {
      Object.assign(member,fs);
      this.selMemberList.push(member);
    } else {
      let index: number = this.selMemberList.findIndex((value) => {
        return fs.pwi == value.pwi;
      });
      this.selMemberList.splice(index, 1);
    }
  }

  addGroupList(g: PageGroupData) {
    if (g.checked) {
      for (let fs of g.fss) {
        let member = {} as Member;
        let index: number = this.selMemberList.findIndex((value) => {
          return fs.pwi == value.pwi;
        });
        if (index < 0) {
          Object.assign(member,fs);
          this.selMemberList.push(member);
        }
      }
    } else {
      for (let fs of g.fss) {
        let index: number = this.selMemberList.findIndex((value) => {
          return fs.pwi == value.pwi;
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
    this.pageFsList.length = 0;
    let groupList = this.grouperService.filterGroups(UserConfig.groups, this.tel);
    let fsList = this.memberService.getfriend(this.tel);
    groupList.forEach((value) => {
      let group: PageGroupData = new PageGroupData();

      Object.assign(group, value);
      group.fss = new Array<Friend>();
      value.fss.forEach((value) => {
        let fs: Friend = {} as Friend;
        Object.assign(fs, value);
        if (fs.rc != UserConfig.account.id) {
          group.fss.push(fs);
        }
      });
      group.gc = group.fss.length;

      this.pageGrouList.push(group);

    });
    fsList.forEach((value) => {
      let fsp: FsPageData = {} as FsPageData;
      Object.assign(fsp, value);
      if (fsp.rc != UserConfig.account.id) {
        fsp.checked = false;
        this.pageFsList.push(fsp);
      }
    });
    this.checkedSet();
  }

  checkedSet() {
    this.pageFsList.forEach((value,index,arr) => {
      value.checked = false;
      let t = this.selMemberList.find(member => {
        return value.pwi == member.pwi;
      });
      if (t){
        value.checked = true;
      }
    });
  }
}
