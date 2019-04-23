import {Component} from '@angular/core';
import {ModalController, NavController, NavParams, ViewController} from 'ionic-angular';
import {FsService} from "./fs.service";
import {GcService} from "../gc/gc.service";
import {UtilService} from "../../service/util-service/util.service";
import {FsData, FsPageData, PageDcData} from "../../data.mapping";
import {DataConfig} from "../../service/config/data.config";

/**
 * Generated class for the 群组参与人选择 page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-fs4g',
  template: `
    <ion-header no-border>
      <ion-toolbar>
        <ion-buttons left>
          <button ion-button icon-only (click)="goBack()" color="danger">
            <img class="img-header-left" src="./assets/imgs/back.png">
          </button>
        </ion-buttons>
        <ion-title>朋友</ion-title>
        <ion-buttons right>
          <button ion-button class="button-header-right" (click)="save()">
            <!--<ion-icon name="add"></ion-icon>--> 确定
          </button>
        </ion-buttons>
      </ion-toolbar>
      <div class="name-input w-auto">
        <ion-input type="text" placeholder="手机号 姓名" (ionChange)="getContacts()" [(ngModel)]="tel"
                   text-center></ion-input>
      </div>
      <div class="selected">
        <ion-chip *ngFor="let g of selFsl" (click)="rmSelected(g)">
          <ion-avatar>
            <img src={{g.bhiu}}>
          </ion-avatar>
          <ion-label>{{g.ran}}</ion-label>
        </ion-chip>
      </div>
    </ion-header>

    <ion-content padding>
      <ion-grid>
        <ion-row *ngFor="let g of pageFsl">
          <ion-avatar item-start >
            <img [src]="g.bhiu">
          </ion-avatar>
          <ion-label>
            {{g.ran}}
            <span>
                   {{g.rc}}
                 </span>
            <span  *ngIf="g.rel ==1">注册</span>
          </ion-label>
          <ion-checkbox (click)="addsel(g)" [(ngModel)]="g.checked"></ion-checkbox>
        </ion-row>
      </ion-grid>
    </ion-content>
  `,
})
export class Fs4gPage {
  tel: any;//手机号
  pageFsl: Array<FsPageData> = new Array<FsPageData>();
  selFsl: Array<FsData> = new Array<FsData>();

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private fsService: FsService,
              public viewCtrl: ViewController,
              private util: UtilService,
              private gsService: GcService,
              private  modalCtrl:ModalController) {
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
      let dc: PageDcData = this.navParams.get('tpara');
      dc.fsl = list;
      this.gsService.save(dc).then(data => {
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
  goTofsDetail(fs:FsData){
    let modal = this.modalCtrl.create(DataConfig.PAGE._FD_PAGE,{fsData:fs});
    modal.present();
  }
}
