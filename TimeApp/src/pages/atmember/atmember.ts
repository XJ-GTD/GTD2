import {Component} from '@angular/core';
import {ModalController, NavController, NavParams, ViewController} from 'ionic-angular';
import {UtilService} from "../../service/util-service/util.service";
import {MemberPageData} from "../../data.mapping";
import {Member} from "../../service/business/event.service";
import {UserConfig} from "../../service/config/user.config";
import {Annotation, AnnotationService} from "../../service/business/annotation.service";
import * as anyenum from "../../data.enum";
import * as moment from "moment";

/**
 * Generated class for the 参与人选择 page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-atmember',
  template: `

    <modal-box title="@谁" [buttons]="buttons" (onSave)="save()" (onCancel)="goBack()">
      <!--<div class="searchbar">-->
      <!--<ion-searchbar type="text" placeholder="手机号 姓名" (ionChange)="getMembers()" [(ngModel)]="tel"-->
      <!--text-center></ion-searchbar>-->
      <!--</div>-->
      <ion-scroll scrollY="true" scrollheightAuto>
        <!--<ion-list>-->
        <!--<ion-list-header>-->
        <!--选择(<span class="count">{{selMemberList.length}}</span>)人-->
        <!--</ion-list-header>-->
        <!--<ion-item >-->
        <!--<ion-label>-->
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

        <ion-list>
          <ion-list-header>
            选择 ( <span class="count">{{selMemberList.length}}</span> ) 人
          </ion-list-header>
          <ion-item>
            <ion-label>
              <ul>
                <li *ngFor="let member of pageMemberList" (click)="rmOrAdd(member)">
                  <span [class.selected]="member.checked"> {{ member.ran }}</span>
                </li>
                <li>
                </li>
              </ul>
            </ion-label>
          </ion-item>

          <!--<ion-item *ngFor="let member of pageMemberList" >-->

          <!--<ion-label>-->
          <!--{{member.ran}}-->
          <!--<span *ngIf="member.rel ==1">（注册）</span>-->
          <!--</ion-label>-->

          <!--<ion-checkbox (click)="addsel(member)" [(ngModel)]="member.checked"></ion-checkbox>-->
          <!--</ion-item>-->
        </ion-list>
      </ion-scroll>

    </modal-box>
  `,
})
export class AtMemberPage {


  buttons: any = {
    remove: false,
    share: false,
    create: false,
    save: true,
    cancel: true
  };

  evi: string;
  evn: string;
  ui: string;

  tel: any;//手机号
  pageMemberList: Array<MemberPageData> = new Array<MemberPageData>();
  selMemberList: Array<Member> = new Array<Member>();

  constructor(public navCtrl: NavController,
              public viewCtrl: ViewController,
              public navParams: NavParams,
              private annotationService: AnnotationService,
              private util: UtilService,) {

    if (this.navParams && this.navParams.data) {
      this.pageMemberList.length = 0;
      this.evi = this.navParams.data.evi;
      this.evn = this.navParams.data.evn;
      this.ui = this.navParams.data.ui;
      this.getMembers();
    }
  }

  rmOrAdd(member: Member) {
    let index: number = this.selMemberList.findIndex((value) => {
      return member.pwi == value.pwi;
    });
    if (index >= 0) {
      this.selMemberList.splice(index, 1);
    } else {
      // Object.assign(member,mp);
      this.selMemberList.push(member);
    }
    this.checkedSet();
  }

  save() {

    let list = this.selMemberList;
    if (list.length > 0) {

      let data: Object = {
        members: list
      };
      let annotation = new Annotation();
      annotation.ui = this.ui;
      annotation.obi = this.evi;
      annotation.content = this.evn;
      for (let member of list) {
        annotation.rcs.push(member.rc);
      }

      this.annotationService.saveAnnotation(annotation);
      this.viewCtrl.dismiss(data);
    } else {
      this.util.popoverStart("没有选择@ 的人");
    }

  }

  addsel(mp: MemberPageData) {

    let member = {} as Member;
    if (mp.checked) {
      Object.assign(member, mp);
      this.selMemberList.push(member);
    } else {
      let index: number = this.selMemberList.findIndex((value) => {
        return mp.pwi == value.pwi;
      });
      this.selMemberList.splice(index, 1);
    }
  }

  goBack(page: any, para: any) {
    this.navCtrl.pop();
  }

  getMembers() {
    if (this.navParams.data.members) {
      let memberList = this.annotationService.getMembers(this.navParams.data.members, this.tel);

      memberList.forEach((value) => {
        let mp: MemberPageData = {} as MemberPageData;
        Object.assign(mp, value);
        if (mp.rc != UserConfig.account.id) {
          mp.checked = false;
          this.pageMemberList.push(mp);
        }
      });
    }
    this.checkedSet();
  }

  checkedSet() {
    this.pageMemberList.forEach((value, index, arr) => {
      value.checked = false;
      let t = this.selMemberList.find(member => {
        return value.pwi == member.pwi;
      });
      if (t) {
        value.checked = true;
      }
    });
  }
}
