import {Component} from '@angular/core';
import {ModalController, NavController, NavParams, ViewController} from 'ionic-angular';
import {FsService} from "./fs.service";
import {UtilService} from "../../service/util-service/util.service";
import {FsData, FsPageData, PageDcData} from "../../data.mapping";
import {DataConfig} from "../../service/config/data.config";
import {GrouperService} from "../../service/business/grouper.service";

/**
 * Generated class for the 群组参与人选择 page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-fs4g',
  template: `

    <modal-box title="{{dc.gn}}" [buttons]="buttons" (onSave)="save()" (onCancel)="goBack()">

      <div class="searchbar">
        <ion-searchbar type="text" placeholder="手机号 姓名" (ionChange)="getContacts()" [(ngModel)]="tel"
                       text-center></ion-searchbar>
      </div>

      <ion-scroll scrollY="true" scrollheightAuto>
        <!--<ion-list>-->
          <!--<ion-list-header>-->
            <!--选择(<span class="count">{{selFsl.length}}</span>)人-->
          <!--</ion-list-header>-->
          <!--<ion-item >-->
            <!--<ion-label>-->
              <!--<ul>-->
                <!--<li *ngFor="let g of selFsl" (click)="rmSelected(g)">-->
                  <!--<span> {{ g.ran }}</span>-->
                <!--</li>-->
                <!--<li>-->
                <!--</li>-->
              <!--</ul>-->
            <!--</ion-label>-->
          <!--</ion-item>-->
        <!--</ion-list>-->

        <ion-list >        
          <ion-item *ngFor="let member of pageFsl" >
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
export class Fs4gPage {

  buttons: any = {
    save: true,
    cancel: true
  };

  tel: any;//手机号
  pageFsl: Array<FsPageData> = new Array<FsPageData>();
  selFsl: Array<FsData> = new Array<FsData>();
  dc: PageDcData;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private fsService: FsService,
              public viewCtrl: ViewController,
              private util: UtilService,
              private gsService: GrouperService,
              private  modalCtrl:ModalController) {

    this.dc = this.navParams.get('tpara');
  }

  ionViewDidEnter() {
    this.getContacts();
  }


  rmSelected(fs: FsData) {
    let index: number = this.selFsl.findIndex((value) => {
      return fs.pwi == value.pwi;
    });
    this.selFsl.splice(index, 1);
    this.checkedSet();
  }

  save() {
    let list = this.selFsl;
    if (list.length > 0) {
      this.dc.fsl = list;
      this.gsService.save(this.dc).then(data => {
          this.goBack();
          //TODO 错误提示
      });
    } else {
      this.util.popoverStart("请先选择朋友");
    }

  }

  addsel(fs: any) {
    if (fs.checked) {
      this.selFsl.push(fs);
    } else {
      let index: number = this.selFsl.findIndex((value) => {
        return fs.pwi == value.pwi;
      });
      this.selFsl.splice(index, 1);
    }
  }

  goBack() {
    this.navCtrl.pop();
  }

  getContacts() {
    this.pageFsl.splice(0, this.pageFsl.length);
    let fsl = this.fsService.getfriend(this.tel);
    fsl.forEach((value) => {
      let fs: FsPageData = new FsPageData();
      Object.assign(fs, value);
      fs.checked = false;
      this.pageFsl.push(fs);
    });
    this.checkedSet();
  }

  checkedSet() {
    this.pageFsl.forEach((value) => {
      value.checked = false;
    });

    for (let f of this.selFsl) {
      let t = this.pageFsl.find(value => {
        return value.pwi == f.pwi;
      });
      if (t) t.checked = true;
    }
  }
}
