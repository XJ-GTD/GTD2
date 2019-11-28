import {Component, Renderer2} from '@angular/core';
import {ModalController, NavController, NavParams, ViewController} from 'ionic-angular';
import {MemberService} from "./member.service";
import {UtilService} from "../../service/util-service/util.service";
import {GlService} from "../gl/gl.service";
import {FsData, FsPageData, PageGroupData} from "../../data.mapping";
import {DataConfig} from "../../service/config/data.config";
import {FeedbackService} from "../../service/cordova/feedback.service";
import {Member} from "../../service/business/event.service";
import {UserConfig} from "../../service/config/user.config";

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
        <ion-list>
          <ion-item >
            <ion-label>
              <ul>
                <li *ngFor = "let member of selMemberList" (click)="rmSelected(member)">
                  <span> {{ member.ran }}</span>
                </li>
                <li>
                </li>
              </ul>
            </ion-label>
          </ion-item>
        </ion-list>
        
        <ion-list >
          <ion-list-header>
            选择参与人
          </ion-list-header>
          <ion-item *ngFor="let g of pageGrouList" >

            <ion-label>
              {{g.gn}}({{g.gc}})
            </ion-label>

            <ion-checkbox (click)="addGroupList(g)" [(ngModel)]="g.checked"></ion-checkbox>
          </ion-item>
          <ion-item *ngFor="let member of pageFsList" >

            <ion-label>
              {{member.ran}}ioni
              <span *ngIf="member.rel ==1">（注册）</span>
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
              private glService: GlService,
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
      for (let fs of g.fsl) {
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
      for (let fs of g.fsl) {
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
    let groupList = this.glService.getGroups(this.tel);
    let fsList = this.memberService.getfriend(this.tel);
    groupList.forEach((value) => {
      let group: PageGroupData = new PageGroupData();

      Object.assign(group, value);
      group.fsl = new Array<FsData>();
      value.fsl.forEach((value) => {
        let fs: FsData = new FsData();
        Object.assign(fs, value);
        if (fs.rc != UserConfig.account.id) {
          group.fsl.push(fs);
        }
      });
      group.gc = group.fsl.length;

      this.pageGrouList.push(group);

    });
    fsList.forEach((value) => {
      let fsp: FsPageData = new FsPageData();
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
