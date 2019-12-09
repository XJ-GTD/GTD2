import {Component, ElementRef, Renderer2, ViewChild} from '@angular/core';
import {IonicPage, NavController} from 'ionic-angular';
import {UtilService} from "../../service/util-service/util.service";
import {SqliteExec} from "../../service/util-service/sqlite.exec";
import {LogTbl} from "../../service/sqlite/tbl/log.tbl";
import * as moment from "moment";

/**
 * Generated class for the 备份恢复 page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-log',
  template: `

    <page-box title="日志" [buttons]="buttons" (onBack)="goBack()" (onRemove)="clear()" nobackgroud nobottom>
      <ion-toolbar>
        <div radio-group class="typegroup" [ngModel]="search.t">
          <button>
            <ion-label>sqlite</ion-label>
            <ion-radio value="0" (click)="list1(0)"></ion-radio>
          </button>
          <button>
            <ion-label>restful</ion-label>
            <ion-radio value="1" (click)="list1(1)"></ion-radio>
          </button>
          <button>
            <ion-label>ws</ion-label>
            <ion-radio value="2" (click)="list1(2)"></ion-radio>
          </button>
        </div>
        <div radio-group class="status" [ngModel]="search.st">

          <button>
            <ion-label>成功</ion-label>
            <ion-radio value="true" (click)="list2(true)"></ion-radio>
          </button>

          <button>
            <ion-label>失败</ion-label>
            <ion-radio value="false" (click)="list2(false)"></ion-radio>
          </button>
        </div>
      </ion-toolbar>


      <ion-scroll scrollY="true" scrollheightAuto>
        <ion-list no-lines>
          <ion-list-header>
            日志，临时页面
          </ion-list-header>
          <ion-item *ngFor="let log of logs">
            <h2>{{log.date}}</h2>
            <h3>{{log.url}}</h3>
            <h3>{{log.sub / 1000}}秒</h3>
            <p>{{log.status}}</p>
            <p>{{log.err}}</p>
          </ion-item>
        </ion-list>
      </ion-scroll>
    </page-box>
  `,
})
export class LogPage {
  buttons: any = {
    remove: true,
    cancel: true
  };

  logs: Array<LogPageData> = new Array<LogPageData>();

  search: LogTbl = new LogTbl();

  constructor(public navCtrl: NavController,
              private sqlite: SqliteExec) {
  }

  ionViewDidLoad() {
    this.search.t = 0;
    this.search.st = true;
    this.list();
  }

  list1(x: number) {
    this.search.t = x;
    this.list();
  }

  list2(b: boolean) {
    this.search.st = b;
    this.list();
  }

  list() {

    // this.sqlite.getLogs(this.search).then(data => {
    //   this.logs = new Array<LogPageData>();
    //
    //   for (let log of data) {
    //     let logPage: LogPageData = new LogPageData();
    //     logPage.date = moment(log.wtt).format("YYYY-MM-DD HH:ss:mm");
    //
    //     logPage.url = log.su;
    //     logPage.sub = log.ss;
    //     logPage.status = log.st ? "成功" : "失败";
    //     logPage.err = log.er;
    //     this.logs.push(logPage);
    //   }
    //
    // })
  }

  clear() {
    this.sqlite.delete(new LogTbl()).then(d => {
      this.list();
    })
  }

  goBack() {
    this.navCtrl.pop();
  }
}

class LogPageData {
  id: string;
  url: string
  date: string;
  sub: number;
  status: string;
  err: string;
}
