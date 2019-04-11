import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {FsService} from "./fs.service";
import {GcService, PageDcData} from "../gc/gc.service";
import {DataConfig} from "../../service/config/data.config";
import {FdService} from "../fd/fd.service";
import {UtilService} from "../../service/util-service/util.service";
import {GlService} from "../gl/gl.service";
import {FsData} from "../../service/pagecom/pgbusi.service";
import {UserConfig} from "../../service/config/user.config";

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
            <img class="img-header-left" src="./assets/imgs/fh2.png">
          </button>
        </ion-buttons>
        <ion-title>朋友</ion-title>
        <ion-buttons right>
          <button ion-button (click)="save()" color="danger"> 确定
          </button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content padding>
      <div class="name-input w-auto">
        <ion-input type="text" placeholder="请输入手机号或名称" (ionChange)="getContacts()" [(ngModel)]="tel"
                   text-center></ion-input>
      </div>
      <ion-grid>
        <ion-row>
          <ion-list *ngIf="addType=='rc'" no-lines style="margin-bottom: 0">
            <ion-item class="plan-list-item" *ngFor="let g of gl">
              <ion-avatar item-start>
                <img src={{g.gm}}>
              </ion-avatar>
              <ion-label>
                {{g.gn}}({{g.gc}})
              </ion-label>
              <ion-checkbox (click)="addgl(g)"></ion-checkbox>
            </ion-item>
          </ion-list>
          <ion-list no-lines>
            <ion-item class="plan-list-item" *ngFor="let g of fsl">
              <ion-avatar item-start>
                <img [src]="g.hiu">
                <!--<ion-icon name="contact"  style="font-size: 3.0em;color: red;"></ion-icon>-->
              </ion-avatar>
              <ion-label>
                {{g.rn}}
                <span style="font-size:14px;color:rgb(102,102,102);">
                   {{g.rc}}
                 </span>
              </ion-label>
              <ion-checkbox (click)="addsel(g)"></ion-checkbox>
            </ion-item>
          </ion-list>
        </ion-row>
      </ion-grid>
    </ion-content>
  `,
})
export class Fs4cPage {
  tel: any;//手机号
  fsl: Array<FsData> = new Array<FsData>();
  gl: Array<PageDcData> = new Array<PageDcData>();
  addType: string = ''; // 群组成员gc,日程共享rc,bl黑名单
  tpara: any = null; //跳转传参
  selFsl: Map<string, any> = new Map<string, any>();

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private fsService: FsService,
              private util: UtilService,
              private fdService: FdService,
              private glService: GlService,
              private gsService: GcService) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Fs4cPage');
    this.addType = this.navParams.get('addType');
    this.tpara = this.navParams.get('tpara');

  }

  ionViewDidEnter() {
    console.log("3.0 ionViewDidEnter 当进入页面时触发");
    this.getContacts();
  }

  save() {
    if (this.selFsl.size > 0) {
      let list = [];
      this.selFsl.forEach((value, key) => {
        if (value.gc && value.gc > 0) {
          let arr: Array<any> = value.fsl;
          for (let ar of arr) {
            if (!this.selFsl.get(ar.pwi)) {
              list.push(ar);
            }
          }
          //list.push(arr);//群组人员
        } else {
          list.push(value);
        }
      });

      if (this.addType == 'rc') {
        this.fsService.sharefriend(this.tpara, list).then(data => {
          if (data.code == 0) {
            this.navCtrl.popAll();
          }
        })
      } else if (this.addType == 'gc') {
        let dc: PageDcData = this.tpara;
        dc.fsl = list;
        this.gsService.save(dc).then(data => {
          if (data.code == 0) {
            //alert("添加群组成员成功");
            this.goBack(DataConfig.PAGE._GC_PAGE, {g: this.tpara});
          }
        })
      } else if (this.addType == 'bl') {

        if (list.length > 1) {
          //alert("每次只能添加一人")
          this.util.toast('每次只能添加一人', 2000);
          return;
        }
        let fd: FsData = new FsData();
        Object.assign(fd, list[0]);
        this.fdService.putBlack(fd).then(data => {
          if (data.code == 0) {
            //alert("添加黑名单成功");
            this.goBack(DataConfig.PAGE._BL_PAGE, '');
          }
        })
      } else {
        this.goBack('', '');
      }

    } else {
      alert("请先选择人员");
    }

  }

  addsel(fs: any) {
    if (this.selFsl.get(fs.pwi) != null) {
      this.selFsl.delete(fs.pwi);
    } else {
      this.selFsl.set(fs.pwi, fs);
    }
  }

  addgl(fs: any) {
    if (this.selFsl.get(fs.gi) != null) {
      this.selFsl.delete(fs.gi);
    } else {
      this.selFsl.set(fs.gi, fs);
    }
  }

  goBack(page: any, para: any) {
    this.navCtrl.pop();
  }

  getContacts() {
      this.gl = UserConfig.groups;
      this.fsl = UserConfig.friends;
      //this.gl = this.glService.getGroups(this.tel);
      //this.fsl = this.fsService.getfriend(this.tel);
  }
}
