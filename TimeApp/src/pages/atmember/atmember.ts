import {Component} from '@angular/core';
import {ModalController, NavController, NavParams, ViewController} from 'ionic-angular';
import {UtilService} from "../../service/util-service/util.service";
import { MemberPageData} from "../../data.mapping";
import {Member} from "../../service/business/event.service";
import {UserConfig} from "../../service/config/user.config";
import {AtMember, AtMemberService} from "../../service/business/atmember.service";
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

    <modal-box title="邀请人" [buttons]="buttons" (onSave)="save()" (onCancel)="goBack()">

      <div class="searchbar">
        <ion-searchbar type="text" placeholder="手机号 姓名" (ionChange)="getMembers()" [(ngModel)]="tel"
                       text-center></ion-searchbar>
      </div>

      <ion-scroll scrollY="true" scrollheightAuto>
        <ion-list>
          <ion-list-header>
            选择(<span class="count">{{selMemberList.length}}</span>)人
          </ion-list-header>
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
          <ion-item *ngFor="let member of pageMemberList" >

            <ion-label>
              {{member.ran}}
              <span *ngIf="member.rel ==1">（注册）</span>
            </ion-label>

            <ion-checkbox (click)="addsel(member)" [(ngModel)]="member.checked"></ion-checkbox>
          </ion-item>
        </ion-list>
      </ion-scroll>
       
    </modal-box>
  `,
})
export class AtMemberPage {


  buttons: any = {
    remove: false,
    share: false,
    create:false,
    save: true,
    cancel: true
  };

  evi:string;
  evn:string;

  tel: any;//手机号
  pageMemberList: Array<MemberPageData> = new Array<MemberPageData>();
  selMemberList: Array<Member> = new Array<Member>();

  constructor(public navCtrl: NavController,
              public viewCtrl: ViewController,
              public navParams: NavParams,
              private atmemberService: AtMemberService,
              private util: UtilService,) {

    if (this.navParams && this.navParams.data ) {
      this.pageMemberList.length = 0;
      this.evi = this.navParams.data.evi;
      this.evn = this.navParams.data.evn;
      this.getMembers();
    }
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
    let atmembers = new Array<AtMember>();
    if (list.length > 0) {

      let data: Object = {
        members : list
      };

      for (let member of list){
        let atmember =  {} as AtMember;
        atmember.ui = member.ui;
        atmember.obt = anyenum.ObjectType.Event;
        atmember.obi = this.evi;
        atmember.dt = moment().format("YYYY/MM/DD HH:mm");
        atmember.content = this.evn;
        atmembers.push(atmember);
      }
      this.atmemberService.saveAtMember(atmembers);
      this.viewCtrl.dismiss(data);
    } else {
      this.util.popoverStart("请选择参与人");
    }

  }

  addsel(mp: MemberPageData) {

    let member = {} as Member;
    if (mp.checked) {
      Object.assign(member,mp);
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

  getMembers(){
    if (this.navParams.data.members ) {
      let memberList = this.atmemberService.getMembers(this.navParams.data.members, this.tel);

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
}
