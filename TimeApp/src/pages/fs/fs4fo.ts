import {Component} from '@angular/core';
import {ModalController, NavController, NavParams, ViewController} from 'ionic-angular';
import {FsService} from "./fs.service";
import {UtilService} from "../../service/util-service/util.service";
import {FsData, FsPageData, PageDcData} from "../../data.mapping";
import {DataConfig} from "../../service/config/data.config";
import {UserConfig} from "../../service/config/user.config";
import {Friend} from "../../service/business/grouper.service";

/**
 * Generated class for the 项目跟进 通知人员选择 page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-fs4fo',
  template: `


    <modal-box title="{{dc.gn}}" [buttons]="buttons" (onSave)="save()" (onCancel)="goBack()">

      <div class="searchbar">
        <ion-searchbar type="text" placeholder="手机号 姓名" (ionChange)="getContacts()" [(ngModel)]="tel"
                       text-center></ion-searchbar>
      </div>

      <ion-scroll scrollY="true" scrollheightAuto>
        <ion-list>
          <ion-list-header>
            选择(<span class="count">{{selFsl.length}}</span>)人
          </ion-list-header>
          <ion-item >
            <ion-label>
              <ul>
                <li *ngFor="let g of selFsl" (click)="rmSelected(g)">
                  <span> {{ g.ran }}</span>
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
          <ion-item *ngFor="let g of pageFsl" >

            <ion-label>
              {{g.ran}}
              <span *ngIf="g.rel ==1">（注册）</span>
            </ion-label>

            <ion-checkbox (click)="addsel(g)" [(ngModel)]="g.checked"></ion-checkbox>
          </ion-item>
        </ion-list>
      </ion-scroll>
    </modal-box>   
  `,
})
export class Fs4foPage {


  buttons: any = {
    save: true,
    cancel: true
  };

  tel: any;//手机号
  pageFsl: Array<FsPageData> = new Array<FsPageData>();
  selFsl: Array<Friend> = new Array<Friend>();

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private fsService: FsService,
              public viewCtrl: ViewController,
              private util: UtilService,
              private  modalCtrl:ModalController) {
  }

  ionViewDidEnter() {
    let selected: Array<string> = new Array<string>();

    if (this.navParams.get('selected')) {
      selected = this.navParams.get('selected');
    }

    this.getContacts(selected);
  }


  rmSelected(fs: Friend) {
    let index: number = this.selFsl.findIndex((value) => {
      return fs.pwi == value.pwi;
    });
    this.selFsl.splice(index, 1);
    this.checkedSet();
  }

  save() {
    let selected: Array<string> = new Array<string>();

    for (let p of this.selFsl) {
      selected.push(p.rc);
    }

    this.viewCtrl.dismiss({selected: selected});
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

  getContacts(selected: Array<string>) {
    this.pageFsl.splice(0, this.pageFsl.length);
    let fsl = this.fsService.getfriend(this.tel);
    fsl.forEach((value) => {
      let fs: FsPageData = {} as FsPageData;
      fs.checked = false;
      Object.assign(fs, value);

      if (fs.rel == '1' && fs.rc != UserConfig.account.id) {
        if (selected.indexOf(fs.rc) > -1) {
          fs.checked = true;
          this.selFsl.push(fs);
        } else {
          fs.checked = false;
        }
        this.pageFsl.push(fs);
      }
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
