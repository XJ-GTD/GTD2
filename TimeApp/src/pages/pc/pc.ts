import {Component, ViewChild} from '@angular/core';
import {IonicPage, NavController} from 'ionic-angular';
import {PcService} from "./pc.service";
import {UtilService} from "../../service/util-service/util.service";
import {PagePcPro} from "../../data.mapping";

/**
 * Generated class for the 计划新建 page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-pc',
  template:
    `    
    <modal-box title="添加日历" [buttons]="buttons" (onSave)="save()" (onCancel)="goBack()">
      <div class="plantitle font-large">
        <ion-input #input type="text" placeholder="输入日历名称" [(ngModel)]="jhcData.jn"></ion-input>
      </div>
        <ion-scroll scrollY="true" scrollheightAuto>
          <ion-list radio-group [(ngModel)]="jhcData.jc" class="onlyone">
            <ion-list-header class="plan-list-item">
              选择颜色
            </ion-list-header>
            <ion-item *ngFor="let color of colors">
              <ion-label>
                <ion-icon class="fas fa-circle font-large-x"
                          [ngStyle]="{'color': color.color}" *ngIf="jhcData.jc !=  color.color"></ion-icon>
                <ion-icon class="fas fa-dot-circle font-large-x"
                          [ngStyle]="{'color':  color.color}" *ngIf="jhcData.jc ==  color.color"></ion-icon>
                {{color.name}}

              </ion-label>
              <ion-radio value="{{color.color}}"  class="noshow" ></ion-radio>
            </ion-item>
          </ion-list>
        </ion-scroll>
    </modal-box>    
`,
})
export class PcPage {

  colors:any = [
    {color:'#308158',name:"氧化铁绿"},
    {color:'#3591A5',name:"深水蓝"},
    {color:'#51AAF2',name:"天蓝色"},
    {color:'#453B93',name:"亮紫"},
    {color:'#C077DB',name:"淡紫"},
    {color:'#AD8387',name:"粉红色"},
    {color:'#AF2B24',name:"橙色"},
    {color:'#CF4425',name:"橙黄"},
    {color:'#996A29',name:"向日葵黄"},
    {color:'#9B5E4B',name:"牛皮棕"},
    {color:'#308158',name:"氧化铁绿"},
    {color:'#3591A5',name:"深水蓝"},
    {color:'#51AAF2',name:"天蓝色"},
    {color:'#453B93',name:"亮紫"},
    {color:'#C077DB',name:"淡紫"},
    {color:'#AD8387',name:"粉红色"},
    {color:'#AF2B24',name:"橙色"},
    {color:'#CF4425',name:"橙黄"},
    {color:'#996A29',name:"向日葵黄"},
    {color:'#9B5E4B',name:"牛皮棕"},
  ]

  buttons: any = {
    remove: false,
    share: false,
    save: true,
    cancel: true
  };


  @ViewChild('input') input;

  jhcData:PagePcPro = new PagePcPro();

  constructor(private navCtrl: NavController,
              private util: UtilService,
              private pcService:PcService) {
    this.jhcData.jc = "#9B5E4B"; // 默认选中颜色  牛皮棕
  }

  ionViewDidLoad() {
  }

  ionViewDidEnter(){
    setTimeout(() => {
      this.input.setFocus();//为输入框设置焦点
    },150);
  }

  goBack() {
    this.navCtrl.pop();
  }

  save(){
    if(this.jhcData.jn != "" && this.jhcData.jn != null ){
      if(this.jhcData.jc != "" && this.jhcData.jc != null ){
        this.pcService.savePlan(this.jhcData).then(data=>{
          this.navCtrl.pop();
        }).catch(res=>{
        });
      }else{
        this.util.popoverStart('日历颜色不能为空');
      }
    }else{
      this.util.popoverStart('日历名称不能为空');
    }

  }
}
