import {Component} from '@angular/core';
import {Events, IonicPage, NavController, NavParams, ViewController} from 'ionic-angular';
import {FsService} from "./fs.service";
import {GcService, PageDcData} from "../gc/gc.service";
import {DataConfig} from "../../service/config/data.config";
import {FdService} from "../fd/fd.service";
import {UtilService} from "../../service/util-service/util.service";
import {GlService} from "../gl/gl.service";
import {FsData} from "../../service/pagecom/pgbusi.service";

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
            <img class="img-header-left" src="./assets/imgs/fh2.png">
          </button>
        </ion-buttons>
        <ion-title>联系人</ion-title>
        <ion-buttons right>
          <button ion-button (click)="save()" color="danger">
            <!--<ion-icon name="add"></ion-icon>--> 确定
          </button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content padding>
      <!--<div style="margin: 0px 0px;">-->
        <!--<ion-item style="height: 50px">-->
          <!--<ion-input type="tel" [(ngModel)]="tel" (ionBlur)="getContacts()" placeholder="请输入手机号" clearInput></ion-input>-->
        <!--</ion-item>-->
      <!--</div>-->
      <div class="name-input w-auto">
        <ion-input type="text" placeholder="请输入手机号或名称" (ionChange)="getContacts()" [(ngModel)]="tel"  text-center></ion-input>
      </div>
      <ion-grid>
        <ion-row>
          <ion-list no-lines>
            <ion-item class="plan-list-item"  *ngFor="let g of fsl">
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
export class Fs4gPage {
  tel:any;//手机号
  fsl:Array<FsData> = new Array<FsData>();
  gl:Array<PageDcData> = new Array<PageDcData>();
  tpara:any = null; //跳转传参
  selFsl:Map<string,any> = new Map<string,any>();
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private fsService:FsService,
              public viewCtrl: ViewController,
              private gsService : GcService) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FsPage');
    this.tpara = this.navParams.get('tpara');

  }
  ionViewDidEnter(){
    console.log("3.0 ionViewDidEnter 当进入页面时触发");
    this.getFdl(new FsData());
  }
  save(){
    if(this.selFsl.size>0){
      let list = [];
      this.selFsl.forEach((value , key) =>{
          list.push(value);
      });
      let dc:PageDcData = this.tpara;
      dc.fsl = list;
      this.gsService.save(dc).then(data=>{
        if(data.code==0){
          //alert("添加群组成员成功");
          this.goBack();
        }
      })

    }else{
      alert("请先选择人员");
    }

  }

  addsel(fs:any){
    if(this.selFsl.get(fs.pwi) != null){
      this.selFsl.delete(fs.pwi);
    }else{
      this.selFsl.set(fs.pwi,fs);
    }
  }

  addgl(fs:any){
    if(this.selFsl.get(fs.gi) != null){
      this.selFsl.delete(fs.gi);
    }else{
      this.selFsl.set(fs.gi,fs);
    }
  }

  goBack() {
    console.log('PfPage跳转PaPage');
    this.viewCtrl.dismiss();
    // this.navCtrl.pop();
  }

  getFdl(fs:FsData){
    this.fsService.getfriend(fs).then(data=>{
      if(data){
        this.fsl = data;
        this.selFsl.clear();
      }
    })
  }

  getContacts(){
    if(this.tel && this.tel != null && this.tel !=''){
      let fs = new FsData();
      fs.rc = this.tel;
      fs.rn = this.tel;
      fs.ran = this.tel;
      this.getFdl(fs);
    }

  }
}
