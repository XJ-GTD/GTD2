import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {FsService, PageFsData} from "./fs.service";
import {GcService, PageDcData} from "../gc/gc.service";
import {DataConfig} from "../../service/config/data.config";
import {FdData, FdService} from "../fd/fd.service";
import {UtilService} from "../../service/util-service/util.service";
import {GlService} from "../gl/gl.service";

/**
 * Generated class for the 参与人选择 page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-fs',
  template: `
    <ion-header no-border>
      <ion-toolbar>
        <ion-buttons left>
          <button ion-button icon-only (click)="goBack('','')" color="danger">
            <ion-icon name="arrow-back"></ion-icon>
          </button>
        </ion-buttons>
        <ion-title>选择参与人</ion-title>
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
        <ion-input type="text" placeholder="请输入手机号" [(ngModel)]="tel"  text-center></ion-input>
      </div>
      <ion-grid>
        <ion-row>
          <ion-list *ngIf="addType=='rc'" no-lines>
            <ion-item class="plan-list-item" *ngFor="let g of gl">
              <ion-label>
                {{g.gn}}({{g.gc}})
              </ion-label>
              <ion-checkbox (click)="addgl(g)"></ion-checkbox>
            </ion-item>
          </ion-list>
          <ion-list no-lines>
            <ion-item class="plan-list-item"  *ngFor="let g of fsl">
              <ion-avatar item-start>
                <!--<img src="http://file03.sg560.com/upimg01/2017/01/932752/Title/0818021950826060932752.jpg">-->
                <ion-icon name="contact"  style="font-size: 3.0em;color: red;"></ion-icon>
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
export class FsPage {
  tel:any;//手机号
  fsl:Array<PageFsData> = new Array<PageFsData>();
  gl:Array<PageDcData> = new Array<PageDcData>();
  addType:string = ''; // 群组成员gc,日程共享rc,bl黑名单
  tpara:any = null; //跳转传参
  selFsl:Map<string,any> = new Map<string,any>();
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private fsService:FsService,
              private util:UtilService,
              private fdService:FdService,
              private glService:GlService,
              private gsService : GcService) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FsPage');
    this.addType = this.navParams.get('addType');
    this.tpara = this.navParams.get('tpara');
    this.getFdl(new PageFsData());
  }

  save(){
    if(this.selFsl.size>0){
      let list = [];
      this.selFsl.forEach((value , key) =>{
        list.push(value);
      });

      if(this.addType == 'rc'){
        this.fsService.sharefriend(this.tpara.si,list).then(data=>{
          if(data.code==0){
            //alert("共享享成功");
            this.goBack('','');
          }
        })
      }else if(this.addType == 'gc'){
        let dc:PageDcData = this.tpara;
        dc.fsl = list;
        this.gsService.save(dc).then(data=>{
          if(data.code==0){
            //alert("添加群组成员成功");
            this.goBack(DataConfig.PAGE._GC_PAGE,{g:this.tpara});
          }
        })
      }else if(this.addType == 'bl'){

        if(list.length>1){
          //alert("每次只能添加一人")
          this.util.toast('每次只能添加一人',2000);
          return;
        }
        let fd:FdData = new FdData();
        Object.assign(fd,list[0]);
        this.fdService.putBlack(fd).then(data=>{
          if(data.code==0){
            //alert("添加黑名单成功");
            this.goBack(DataConfig.PAGE._BL_PAGE,'');
          }
        })
      }else{
        this.goBack('','');
      }

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

  goBack(page:string,para:any) {
    console.log('PfPage跳转PaPage');
    // if(page != ''){
    //   this.navCtrl.push(page,para);
    // }else{
    //   this.navCtrl.pop();
    // }
    this.navCtrl.pop();

  }

  getFdl(fs:PageFsData){
    if(this.addType=='rc'){
      this.glService.getGroups().then(data=>{
        if(data && data.gl){
          this.gl = data.gl;
        }
      })
    }
    this.fsService.getfriend(fs).then(data=>{
      if(data){
        this.fsl = data;
        this.selFsl.clear();
      }
    })
  }

  getContacts(){
    let fs = new PageFsData();
    fs.rc = this.tel;
    this.getFdl(fs);
  }
  toAddGroupMember(){}
}
