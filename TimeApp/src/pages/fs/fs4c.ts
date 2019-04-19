import {Component} from '@angular/core';
import {ModalController, NavController, NavParams} from 'ionic-angular';
import {FsService} from "./fs.service";
import {FdService} from "../fd/fd.service";
import {UtilService} from "../../service/util-service/util.service";
import {GlService} from "../gl/gl.service";
import {FsData, FsPageData, PageGroupData} from "../../data.mapping";
import {DataConfig} from "../../service/config/data.config";

/**
 * Generated class for the 参与人选择 page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-fs4c',
  template: `
    <ion-header no-border>
      <ion-toolbar>
        <ion-buttons left>
          <button ion-button icon-only (click)="goBack()" color="danger">
            <img class="img-header-left" src="./assets/imgs/backfd.png">
          </button>
        </ion-buttons>
        <ion-title>朋友</ion-title>
        <ion-buttons right>
          <button ion-button class="button-header-right" (click)="save()"> 确定
          </button>
        </ion-buttons>
      </ion-toolbar>
      <div class="name-input w-auto">
        <ion-input type="text" placeholder="请输入手机号或名称" (ionChange)="getContacts()" [(ngModel)]="tel"
                   text-center></ion-input>
      </div>
      <div class="selected">
        <ion-chip *ngFor="let g of selFsl" (click)="rmSelected(g)">
          <ion-avatar>
            <img src={{g.bhiu}}>
          </ion-avatar>
          <ion-label>{{g.rn}}</ion-label>
        </ion-chip>
      </div>
    </ion-header>

    <ion-content padding>
      <ion-grid>
        <ion-row *ngFor="let g of pageGl" class="group">
          <ion-avatar item-start>
            <img src={{g.gm}}>
          </ion-avatar>
          <ion-label>
            {{g.gn}}({{g.gc}})
          </ion-label>
          <ion-checkbox (click)="addgl(g)" [(ngModel)]="g.checked"></ion-checkbox>
        </ion-row>
        <ion-row *ngFor="let g of pageFsl">
          <ion-avatar item-start (click)="goTofsDetail(g)">
            <img [src]="g.bhiu">
          </ion-avatar>
          <ion-label>
            {{g.rn}}
            <span> {{g.rc}}</span>
            <span *ngIf="g.rel ==1">注册</span>
          </ion-label>
          <ion-checkbox (click)="addsel(g)" [(ngModel)]="g.checked"></ion-checkbox>
        </ion-row>
      </ion-grid>
    </ion-content>
  `,
})
export class Fs4cPage {
  tel: any;//手机号
  pageFsl: Array<FsPageData> = new Array<FsPageData>();
  pageGl: Array<PageGroupData> = new Array<PageGroupData>();
  selFsl: Array<FsData> = new Array<FsData>();

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private fsService: FsService,
              private util: UtilService,
              private fdService: FdService,
              private glService: GlService,
              private  modalCtrl: ModalController) {
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
      this.fsService.sharefriend(this.navParams.get('tpara'), list).then(data => {
        this.navCtrl.popAll();
        //TODO 错误提示
      });
    } else {
      this.util.popoverStart("请先选择朋友");
    }

  }

  addsel(fs: FsPageData) {

    if (fs.checked) {
      this.selFsl.push(fs);
    } else {
      let index: number = this.selFsl.findIndex((value) => {
        return fs.pwi == value.pwi;
      });
      this.selFsl.splice(index, 1);
    }
  }

  addgl(fs: PageGroupData) {
    if (fs.checked) {
      for (let f of fs.fsl) {
        let index: number = this.selFsl.findIndex((value) => {
          return f.pwi == value.pwi;
        });
        if (index < 0) {
          this.selFsl.push(f);
        }
      }
    } else {
      for (let f of fs.fsl) {
        let index: number = this.selFsl.findIndex((value) => {
          return f.pwi == value.pwi;
        });
        this.selFsl.splice(index, 1);
      }
    }

    this.checkedSet();
  }

  goBack(page: any, para: any) {
    this.navCtrl.pop();
  }

  getContacts() {
    this.pageGl.splice(0, this.pageGl.length);
    this.pageFsl.splice(0, this.pageFsl.length);
    let gl = this.glService.getGroups(this.tel);
    let fsl = this.fsService.getfriend(this.tel);
    gl.forEach((value) => {
      let group: PageGroupData = new PageGroupData();
      Object.assign(group, value);
      this.pageGl.push(group);

    });
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

  goTofsDetail(fs: FsData) {
    let modal = this.modalCtrl.create(DataConfig.PAGE._FD_PAGE, {fsData: fs});
    modal.present();
  }
}
